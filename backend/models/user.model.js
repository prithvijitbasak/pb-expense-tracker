const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "Normal user",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // for createdAt and updatedAt
  }
);

/**
 * Generate Access Token
 * ----------------------
 * What it is:
 *   A short-lived JWT used for normal authenticated requests.
 *
 * Why:
 *   Short life (like 15 min) reduces damage if stolen.
 */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "12h" } // 12 hour
  );
};

/**
 * Generate Refresh Token
 * ------------------------
 * What it is:
 *   A long-lived token stored only in httpOnly cookies.
 *
 * Why:
 *   Used to generate new access tokens without logging in again.
 */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
    },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "7d" } // 7 days
  );
};

/**
 * Compare hashed password
 */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
