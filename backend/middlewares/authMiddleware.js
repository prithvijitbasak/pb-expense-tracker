const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided!" });
  }

  const jwtToken = token.replace("PB-expense-tracker-bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_KEY);

    // Change from email to username for user lookup
    const userData = await User.findOne({ username: isVerified.username }).select({
      password: 0,
    });

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized: User not found!" });
    }

    req.user = userData;
    req.token = token;
    req.userId = userData._id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token!" });
  }
};

module.exports = authMiddleware;
