const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Access token not provided!",
        code: "NO_TOKEN",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token payload!",
        code: "INVALID_PAYLOAD",
      });
    }

    // 5. Fetch user and EXPLICITLY check for refreshToken presence
    // We remove '-refreshToken' from the select so we can check its value
    const userData = await User.findById(decoded.userId).select(
      "-password -__v"
    );

    // SECURITY CHECK: If user doesn't exist OR refreshToken is null (logged out)
    if (!userData || !userData.refreshToken) {
      return res.status(401).json({
        message: "Unauthorized: Session expired or user logged out!",
        code: "SESSION_EXPIRED",
      });
    }

    // Attach user to request (you might want to remove the refreshToken
    // from the object now before passing it to next() for privacy)
    userData.refreshToken = undefined;
    req.user = userData;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        message: "Forbidden: Access token has expired. Refresh required.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      message: "Unauthorized: Invalid token!",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = authMiddleware;
