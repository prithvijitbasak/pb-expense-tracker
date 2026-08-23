const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validate.middleware");
const updateUserSchema = require("../validators/user.validator");
const { upload } = require("../middlewares/upload.middleware");

router
  .route("/update")
  .put(authMiddleware, validate(updateUserSchema), userController.updateUser);
router.route("/me").get(authMiddleware, userController.getUserProfile);
router.route("/upload-image").post(authMiddleware, upload.single("image"), userController.addUserImage);
router.route("/remove-image").post(authMiddleware, userController.removeUserImage);

module.exports = router;
