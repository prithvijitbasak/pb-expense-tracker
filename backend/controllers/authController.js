const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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
    const { fullName, username, email, phone, password } =
      req.body;

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

module.exports = { home, register, login };
