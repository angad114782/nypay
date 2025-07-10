const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  getProfile,
  sendLoginOtp,
  verifyLoginOtp,
  updateProfile,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

router.post("/register", register);             // Send OTP
router.post("/verify-otp", verifyOtp);          // Verify OTP & Create User
router.post("/login", login);                   // Email/password login
router.get("/me", protect, getProfile);         // Get profile (protected)
router.put("/me/update", protect, upload.single("profilePic"), updateProfile); // Update profile
router.post("/send-otp-login", sendLoginOtp);   // WhatsApp OTP
router.post("/verify-otp-login", verifyLoginOtp); // OTP login
router.post("/logout", protect, logout);


module.exports = router;
