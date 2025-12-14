const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract access token from HTTP-only cookie
    const token = req.cookies.accessToken;

    // 2. Block request when token missing
    if (!token) {
      // **Standard 401 for missing token**
      return res.status(401).json({
        message: "Unauthorized: Access token not provided!",
        code: "NO_TOKEN",
      });
    }

    // 3. Verify access token
    // If the token is expired, `jwt.verify` will throw a TokenExpiredError
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    // 4. Check the userId exists in the token
    if (!decoded || !decoded.userId) {
      // **Standard 401 for invalid payload**
      return res.status(401).json({
        message: "Unauthorized: Invalid token payload!",
        code: "INVALID_PAYLOAD",
      });
    }

    // 5. Fetch user by ID
    // Look up the user by the ID in the decoded token
    const userData = await User.findById(decoded.userId).select(
      "-password -refreshToken -__v"
    );

    if (!userData) {
      // **Standard 401 if user doesn't exist**
      return res.status(401).json({
        message: "Unauthorized: User not found!",
        code: "USER_NOT_FOUND",
      });
    }

    // 6. Attach user data to request
    req.user = userData;

    // 7. Continue to the protected route
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    // Check if the error is specifically a token expiration error
    if (error.name === "TokenExpiredError") {
      // **CRITICAL CHANGE:** // Use a distinct status code (like 403 Forbidden) or a custom body code
      // to signal to the frontend's interceptor that it should attempt a refresh.
      return res.status(403).json({
        message: "Forbidden: Access token has expired. Refresh required.",
        code: "TOKEN_EXPIRED",
      });
    }

    // For any other JWT error (invalid signature, malformed token, etc.)
    return res.status(401).json({
      message: "Unauthorized: Invalid token!",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = authMiddleware;
