const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

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
    { expiresIn: "1h" } // 1 hour
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
