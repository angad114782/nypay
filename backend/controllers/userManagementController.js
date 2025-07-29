const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔐 JWT Token generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Register Team User Without OTP
const createTeamUser = async (req, res) => {
  const { profileName, mobile, userId, password, role } = req.body;

  try {
    // ✅ 1. Basic Validation
    if (!profileName || !mobile || !userId || !password || !role) {
      return res.status(400).json({ message: "All fields are required including role" });
    }

    // ✅ 2. Convert createID -> user
    const selectedRole = role === "createID" ? "user" : role;

    // ✅ 3. Check if user exists
    const existingUser = await User.findOne({
      $or: [{ phone: mobile }, { email: userId.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ 4. Create user
    const newUser = await User.create({
      name: profileName,
      phone: mobile,
      email: userId.toLowerCase(),
      password,
      role: selectedRole,
      isVerified: true,
    });

    // ✅ 5. Success response
    res.status(201).json({
      message: "User registered successfully",
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
    console.error("Register Team User Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllTeamUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // ✅ Exclude users with role "user"
    const total = await User.countDocuments({ role: { $ne: "user" } });

    const users = await User.find({ role: { $ne: "user" } })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      users,
    });
  } catch (err) {
    console.error("Get Team Users Error:", err.message);
    res.status(500).json({ message: "Failed to fetch team users" });
  }
};


module.exports = {
  createTeamUser,
  getAllTeamUsers,
};
