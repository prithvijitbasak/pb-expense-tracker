const User = require("../models/user.model");

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = user.toObject();
    delete userProfile._id;

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const updateUser = async (req, res) => {
  try {
    // 1. Extract authenticated user ID from auth middleware
    const userId = req.user._id;

    // 2. Extract incoming data
    const { fullName, username, email, phone } = req.body;

    // 3. Prepare an object to hold the updates
    const updates = {};

    if (fullName) updates.fullName = fullName;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    // 4. UNIQUE CHECK → username
    if (username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // 5. UNIQUE CHECK → email
    if (email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // 6. UNIQUE CHECK → phone
    if (phone) {
      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: userId },
      });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "Phone number already registered" });
      }
    }

    // 7. Update user and return updated document
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 8. Successful update response
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating user",
      error: error.message,
    });
  }
};

module.exports = { updateUser, getUserProfile };
