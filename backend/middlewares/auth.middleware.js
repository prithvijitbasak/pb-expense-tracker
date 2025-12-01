const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract access token from HTTP-only cookie
    const token = req.cookies.accessToken;

    // 2. Block request when token missing
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not provided!" });
    }

    // 3. Verify access token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    // 4. Check the userId exists in the token
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload!" });
    }

    // 5. Fetch user by ID
    const userData = await User.findById(decoded.userId).select("-password");

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized: User not found!" });
    }

    // 6. Attach user data to request
    req.user = userData;

    // 7. Continue
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token!" });
  }
};

module.exports = authMiddleware;
