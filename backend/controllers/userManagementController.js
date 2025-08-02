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

    // ✅ 2. Use role as-is (createID allowed)
    const selectedRole = role;

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
    // ✅ Exclude users with role "user" and "super-admin"
    const total = await User.countDocuments({ role: { $nin: ["user", "super-admin"] } });

    const users = await User.find({ role: { $nin: ["user", "super-admin"] } })
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




// ✅ Delete Team User
const deleteTeamUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deletion of "admin" or "user"
    if (["admin", "user"].includes(user.role)) {
      return res.status(403).json({ message: `Cannot delete a ${user.role}` });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete Team User Error:", err.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};


// ✅ Update Team User Role
const updateUserRoles = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "New role is required" });
    }

    // Prevent updating role to "admin"
    if (role === "admin") {
      return res.status(403).json({ message: "Not allowed to assign admin role" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent updating role of "admin"
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot modify admin role" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (err) {
    console.error("Update Team User Role Error:", err.message);
    res.status(500).json({ message: "Failed to update role" });
  }
};



module.exports = {
  createTeamUser,
  getAllTeamUsers,
  deleteTeamUser,
  updateUserRoles
};
