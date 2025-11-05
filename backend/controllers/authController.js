const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOtpWhatsApp } = require("../utils/sendWhatsApp");
const axios = require("axios");

// 🔐 JWT Token generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =====================
// Register → Send OTP via WhatsApp (phone-only)
// =====================
exports.register = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { phone, type: "register" },
      {
        phone,
        otp,
        type: "register",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        data: {
          name,
          password,
        },
      },
      { upsert: true }
    );

    // send OTP only via WhatsApp
    await sendOtpWhatsApp(phone, otp);

    res.status(200).json({ message: "OTP sent via WhatsApp" });
  } catch (err) {
    console.error("❌ Register OTP Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// =====================
// Verify Register OTP (phone-only)
// =====================
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const record = await Otp.findOne({ phone, type: "register" });

    if (!record)
      return res
        .status(404)
        .json({ message: "OTP not found. Please request again." });
    if (record.otp !== otp)
      return res.status(401).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now())
      return res.status(410).json({ message: "OTP expired" });

    const duplicate = await User.findOne({ phone });
    if (duplicate)
      return res.status(409).json({ message: "User already exists" });

    const newUser = await User.create({
      name: record.data.name,
      phone: record.phone,
      password: record.data.password,
      isVerified: true,
    });

    await Otp.deleteOne({ phone, type: "register" });

    res.status(201).json({
      message: "User created successfully",
      token: generateToken(newUser),
      user: {
        _id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// =====================
// Send OTP for WhatsApp Login (phone-only)
// =====================
exports.sendLoginOtp = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { phone, type: "login" },
      {
        phone,
        otp,
        type: "login",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true }
    );

    await sendOtpWhatsApp(phone, otp);

    res.status(200).json({ message: "OTP sent via WhatsApp" });
  } catch (err) {
    console.error("❌ Login OTP Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// =====================
// Login with phone + password (no email)
// =====================
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // ✅ 1. Basic validation
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    // ✅ 2. Find user and validate password
    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ 3. Check active and verified
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is inactive" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified via OTP" });
    }

    // ✅ 4. Get IP address
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    let locationData = {
      city: "",
      region: "",
      latitude: null,
      longitude: null,
    };

    try {
      // ✅ 5. Fetch geolocation based on IP
      const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
      locationData = {
        city: geoRes.data.city || "",
        region: geoRes.data.region || "",
        latitude: geoRes.data.latitude || null,
        longitude: geoRes.data.longitude || null,
      };

      console.log("📌 Saving login IP & location:", {
        ip,
        ...locationData,
      });
    } catch (geoErr) {
      console.warn("📍 Location fetch failed:", geoErr.message);
    }

    // ✅ 6. Save IP and location to user record
    user.lastLoginIp = ip;
    user.city = locationData.city;
    user.region = locationData.region;
    user.latitude = locationData.latitude;
    user.longitude = locationData.longitude;
    await user.save();

    // ✅ 7. Send response with token and user info
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        lastLoginIp: user.lastLoginIp,
        city: user.city,
        region: user.region,
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// =====================
// Verify Login OTP (phone-only)
// =====================
exports.verifyLoginOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    // ✅ 1. Find OTP record
    const record = await Otp.findOne({ phone, type: "login" });
    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // ✅ 2. Find user
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is inactive" });
    }

    // ✅ 3. Extract IP address
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    let locationData = {
      city: "",
      region: "",
      latitude: null,
      longitude: null,
    };

    try {
      // ✅ 4. Fetch geolocation data
      const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
      locationData = {
        city: geoRes.data.city || "",
        region: geoRes.data.region || "",
        latitude: geoRes.data.latitude || null,
        longitude: geoRes.data.longitude || null,
      };

      console.log("📌 OTP login IP & location:", {
        ip,
        ...locationData,
      });
    } catch (geoErr) {
      console.warn("📍 Location fetch failed:", geoErr.message);
    }

    // ✅ 5. Update user login details
    user.lastLoginIp = ip;
    user.city = locationData.city;
    user.region = locationData.region;
    user.latitude = locationData.latitude;
    user.longitude = locationData.longitude;
    await user.save();

    // ✅ 6. Clean up OTP
    await Otp.deleteOne({ phone, type: "login" });

    // ✅ 7. Return response
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        lastLoginIp: user.lastLoginIp,
        city: user.city,
        region: user.region,
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });
  } catch (err) {
    console.error("❌ Verify Login OTP Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// =====================
// Protected profile route
// =====================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// =====================
// Update Profile (remove email update)
// =====================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (req.file) {
      user.profilePic = `uploads/profile_pic/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// =====================
// Logout
// =====================
exports.logout = async (req, res) => {
  try {
    if (req.user?._id) {
      // console.log(`✅ User logged out: ${req.user._id} at ${new Date()}`);
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout failed:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
};

// =====================
// Change Password
// =====================
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    user.markModified("password"); // ✅ Force pre-save hook to hash
    await user.save();

    res.status(200).json({ message: "✅ Password updated successfully" });
  } catch (err) {
    console.error("❌ Change Password Error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// =====================
// Send Reset OTP (phone-only via WhatsApp)
// =====================
exports.sendResetOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone is required" });

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { phone, type: "reset" },
      {
        phone,
        otp,
        type: "reset",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true }
    );

    await sendOtpWhatsApp(phone, otp);

    res.status(200).json({ message: "OTP sent via WhatsApp" });
  } catch (err) {
    console.error("Send Reset OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// Verify Reset OTP (phone-only)
// =====================
exports.verifyResetOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp)
    return res.status(400).json({ message: "Phone and OTP are required" });

  try {
    const record = await Otp.findOne({ phone, type: "reset" });

    if (!record) return res.status(404).json({ message: "OTP not found" });
    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now())
      return res.status(410).json({ message: "OTP expired" });

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// Reset Password (phone + OTP)
// =====================
exports.resetPassword = async (req, res) => {
  const { phone, otp, newPassword, confirmPassword } = req.body;

  if (!phone || !otp || !newPassword || !confirmPassword)
    return res.status(400).json({ message: "All fields are required" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
    const record = await Otp.findOne({ phone, type: "reset" });
    if (!record) return res.status(404).json({ message: "OTP not found" });
    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now())
      return res.status(410).json({ message: "OTP expired" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    user.markModified("password"); // ✅ Force pre-save hook to hash
    await user.save();

    await Otp.deleteOne({ phone, type: "reset" });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
