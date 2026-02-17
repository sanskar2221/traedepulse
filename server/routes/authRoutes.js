const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// 🔹 GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
  console.error("ERROR:", err);
  res.status(500).json({ message: err.message });
  }
});

// 🔹 UPDATE PROFILE
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
  console.error("ERROR:", err);
  res.status(500).json({ message: err.message });
}
});

// 🔹 CHANGE PASSWORD
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
  console.error("ERROR:", err);
  res.status(500).json({ message: err.message });
}
});

module.exports = router;
