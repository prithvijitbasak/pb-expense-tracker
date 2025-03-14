const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// for home page
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to my website using controllers");
  } catch (error) {
    console.log(error);
  }
};

// for register purpose
const register = async (req, res) => {
  try {
    const { fullName, username, email, phone, password } = req.body;

    // Check if a user exists with either the username or email
    const userExist = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (userExist) {
      if (userExist.username === username) {
        return res
          .status(400)
          .send({ message: "This username already exists" });
      }
      if (userExist.email === email) {
        return res
          .status(400)
          .send({ message: "This email is already registered" });
      }
      if (userExist.phone === phone) {
        return res
          .status(400)
          .send({ message: "This phone number is already used" });
      }
    }

    // Hash password with bcrypt
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);

    // Create new user
    const userCreated = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashPassword,
    });

    // Respond with success message and token
    res.status(200).send({
      message: "Registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error, please try again later." });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Search for user by username, email, or phone
    const userExist = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier },
      ],
    });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await userExist.comparePassword(password);

    if (isPasswordMatch) {
      return res.status(200).json({
        message: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return res(400).send({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Get token from headers
    const token = req.header("Authorization")?.split(" ")[1]; // Extract after "Bearer"
    // console.log("Extracted Token:", token);
    // const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Fetch user from DB excluding password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { home, register, login, getUserProfile };
