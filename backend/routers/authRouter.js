const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authController");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const validate = require("../middlewares/validateMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/").get(authControllers.home);
router
  .route("/register")
  .post(validate(signupSchema), authControllers.register);
router.route("/login").post(validate(loginSchema), authControllers.login);
router.route("/me").get(authControllers.getUserProfile);

module.exports = router;
