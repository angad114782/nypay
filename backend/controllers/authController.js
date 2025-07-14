const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/sendEmail");
const { sendOtpWhatsApp } = require("../utils/sendWhatsApp");

// 🔐 JWT Token generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Register → Send OTP
exports.register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ phone }, { email: email.toLowerCase() }],
    });
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
          email: email.toLowerCase(),
          password,
        },
      },
      { upsert: true }
    );

    await Promise.all([
      sendOtpEmail(email, otp),
      sendOtpWhatsApp(phone, otp),
    ]);

    res.status(200).json({ message: "OTP sent via email and WhatsApp" });
  } catch (err) {
    console.error("❌ Register OTP Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify Register OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const record = await Otp.findOne({ phone, type: "register" });

    if (!record) return res.status(404).json({ message: "OTP not found. Please request again." });
    if (record.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now()) return res.status(410).json({ message: "OTP expired" });

    const duplicate = await User.findOne({
      $or: [{ phone }, { email: record.data.email.toLowerCase() }],
    });
    if (duplicate) return res.status(409).json({ message: "User already exists" });

    const newUser = await User.create({
      name: record.data.name,
      phone: record.phone,
      email: record.data.email.toLowerCase(),
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
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};


// ✅ Send OTP for WhatsApp Login
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


const axios = require("axios");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "User not verified via OTP" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;

let locationData = {};
try {
  const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
  locationData = {
    city: geoRes.data.city,
    region: geoRes.data.region,
    latitude: geoRes.data.latitude,
    longitude: geoRes.data.longitude,
  };

  user.lastLoginIp = ip;
  user.city = locationData.city;
  user.region = locationData.region;
  user.latitude = locationData.latitude;
  user.longitude = locationData.longitude;
  await user.save();
} catch (e) {
  console.error("📍 Location fetch failed:", e.message);
}

res.status(200).json({
  message: "Login successful",
  token: generateToken(user),
  user: {
    _id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    lastLoginIp: user.lastLoginIp,
    city: user.city,
    region: user.region,
    latitude: user.latitude,
    longitude: user.longitude,
  },
});

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const record = await Otp.findOne({ phone, type: "login" });
    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress;

let locationData = {};
try {
  const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
  locationData = {
    city: geoRes.data.city,
    region: geoRes.data.region,
    latitude: geoRes.data.latitude,
    longitude: geoRes.data.longitude,
  };

  user.lastLoginIp = ip;
  user.city = locationData.city;
  user.region = locationData.region;
  user.latitude = locationData.latitude;
  user.longitude = locationData.longitude;
  await user.save();
} catch (e) {
  console.error("📍 Location fetch failed:", e.message);
}


    await Otp.deleteOne({ phone, type: "login" });
res.status(200).json({
  message: "Login successful",
  token: generateToken(user),
  user: {
    _id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
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

// ✅ Protected profile route
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
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
exports.logout = async (req, res) => {
  try {
    // Optional: Track logout time
    console.log(`User logged out: ${req.user._id} at ${new Date()}`);

    // Optional: Invalidate refresh token (if stored in DB)

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
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

