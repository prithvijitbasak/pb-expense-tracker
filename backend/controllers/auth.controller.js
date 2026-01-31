const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidTimezone } = require("./timezone.controller");

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
    const { fullName, username, email, phone, password, role, timezone } =
      req.body;
    // console.log(req.body);

    // 1. Check for existing user
    const userExist = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (userExist) {
      if (userExist.username === username) {
        return res
          .status(400)
          .json({ message: "This username already exists" });
      }
      if (userExist.email === email) {
        return res
          .status(400)
          .json({ message: "This email is already registered" });
      }
      if (userExist.phone === phone) {
        return res
          .status(400)
          .json({ message: "This phone number is already used" });
      }
    }

    // 2. Hash password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    // checking whether the timezone is valid or not
    const valid = await isValidTimezone(timezone);

    if (!valid) {
      return res.status(400).json({
        message: "Invalid or unsupported timezone selected",
      });
    }

    // 3. Create user without refresh token
    const userCreated = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      timezone,
    });

    // 4. Generate tokens after creation
    const refreshToken = userCreated.generateRefreshToken();
    const accessToken = userCreated.generateAccessToken();

    // 5. Save refreshToken in DB
    userCreated.refreshToken = refreshToken;
    await userCreated.save();

    // 6. Send cookies (secure, httpOnly)
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // JS cannot access token → prevents XSS
      secure: true, // only HTTPS
      sameSite: "none", // required for cross-site cookies
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Send final response
    res.status(201).json({
      message: "Registration successful",
      userId: userCreated._id.toString(),
      username: userCreated.username,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by username, email or phone
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

    // Compare password using bcrypt
    const isPasswordMatch = await userExist.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate access and refresh tokens
    const accessToken = userExist.generateAccessToken();
    const refreshToken = userExist.generateRefreshToken();

    // extremely necessary because after logout the refreshtoken is deleted
    // then on login we would must save the refreshToken otherwise the logic will fail
    userExist.refreshToken = refreshToken;
    await userExist.save();

    // Send cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // JS cannot access this
      secure: true, // send only over HTTPS
      sameSite: "strict", // CSRF protection
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    return res.status(201).json({
      message: "Login successful",
      userId: userExist._id.toString(),
      username: userExist.username,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    // 1. The authenticated user is available from middleware
    const user = req.user;

    // 2. Safety check: if somehow no user exists, return a clean error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Remove the refresh token from DB so it becomes unusable
    await User.updateOne({ _id: user._id }, { $set: { refreshToken: null } });

    // 4. Clear authentication cookies from the browser
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // 5. Return proper logout confirmation
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Refresh Token");

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .json({ message: "Refreshed Successfully" });
  });
};

module.exports = { home, register, login, logout, refreshAccessToken };
