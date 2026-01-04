const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const { signupSchema, loginSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.route("/").get(authControllers.home);
router
  .route("/register")
  .post(validate(signupSchema), authControllers.register);
router.route("/login").post(validate(loginSchema), authControllers.login);
router.route("/logout").post(authMiddleware, authControllers.logout);
router.route("/refresh-access-token").post(authControllers.refreshAccessToken);

module.exports = router;
