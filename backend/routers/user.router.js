const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validate.middleware");
const updateUserSchema = require("../validators/user.validator");

router
  .route("/update")
  .put(authMiddleware, validate(updateUserSchema), userController.updateUser);
router.route("/me").get(authMiddleware, userController.getUserProfile);

module.exports = router;
