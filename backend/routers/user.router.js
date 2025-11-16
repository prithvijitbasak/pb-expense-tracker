const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validateMiddleware");
const updateUserSchema = require("../validators/user.validator");

router
  .route("/update")
  .put(authMiddleware, validate(updateUserSchema), userController.updateUser);

module.exports = router;
