const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: Token not provided!" });
    }

    let token = authHeader.trim();

    // Check if the token starts with "Bearer" and remove it
    if (token.startsWith("Bearer")) {
      token = token.replace("Bearer", "").trim();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token format!" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Use `_id` instead of `username` for database lookup
    const userData = await User.findById(decoded.userId).select("-password");

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized: User not found!" });
    }

    req.user = userData;
    req.token = token;
    req.userId = userData._id; // Ensure correct userId is passed

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token!" });
  }
};

module.exports = authMiddleware;
