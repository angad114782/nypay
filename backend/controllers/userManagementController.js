const User = require("../models/UserManagement");
const jwt = require("jsonwebtoken");

// 🔐 JWT Token generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Register Team User Without OTP
const createTeamUser = async (req, res) => {
  try {
    let { profileName, mobile, userId, password, role } = req.body;

    // 1) Basic validation (presence)
    if (!profileName || !mobile || !password || !role) {
      return res.status(400).json({ message: "All fields are required including role" });
    }

    // 2) Normalize inputs
    profileName = String(profileName).trim();
    mobile = String(mobile).trim();
    userId = typeof userId === "string" ? userId.trim() : undefined;

    // Optional: E.164 normalize (backend-wide ek format rakho)
    if (!mobile.startsWith("+")) mobile = `+${mobile}`;

    // 3) Role mapping (agar policy: createID => user)
    const selectedRole = role === "createID" ? "user" : role;

    // 4) Duplicate check (email condition tabhi lagao jab userId diya ho)
    const orFilters = [{ phone: mobile }];
    if (userId) orFilters.push({ email: userId.toLowerCase() });

    const existingUser = await User.findOne({ $or: orFilters });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 5) Create payload (empty email set mat karo)
    const createPayload = {
      name: profileName,
      phone: mobile,
      password,
      role: selectedRole,
      isVerified: true,
    };
    if (userId) createPayload.email = userId.toLowerCase();

    const newUser = await User.create(createPayload);

    // 6) Response
    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser),
      user: {
        _id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email || null,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    console.error("Register Team User Error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate key", details: err.keyValue });
    }
    return res.status(500).json({ message: "Server error" });
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
