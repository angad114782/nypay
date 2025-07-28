const User = require("../models/User");

// ✅ Get All Registered Users (Only with role: 'user')
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // ✅ Only count and fetch users with role "user"
    const total = await User.countDocuments({ role: "user" });
    const users = await User.find({ role: "user" })
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
    console.error("Get Users Error:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.toggleActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "user") {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res
      .status(200)
      .json({
        message: `User marked as ${user.isActive ? "active" : "inactive"}`,
      });
  } catch (err) {
    console.error("Toggle Active Error:", err.message);
    res.status(500).json({ message: "Failed to toggle user status" });
  }
};
