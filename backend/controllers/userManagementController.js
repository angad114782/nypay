// controllers/userManagementController.js
const bcrypt = require("bcryptjs");
// const User = require("../models/User");
const UserManagement = require("../models/UserManagement");
const { default: mongoose } = require("mongoose");

const createTeamUser = async (req, res) => {
  try {
    const { profileName, userId, password, roles } = req.body;

    // Validate required fields
    if (!profileName || !userId || !password) {
      return res.status(400).json({
        message: "Profile name, user ID, and password are required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    // Check if team user already exists
    const teamUserExists = await UserManagement.findOne({
      userId: userObjectId,
    });
    if (teamUserExists) {
      return res.status(400).json({
        message: "Team user already exists with this userId",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const formattedRoles = roles.map((role) => {
      switch (role.toLowerCase()) {
        case "admin":
          return "Admin";
        case "deposit":
          return "Deposit";
        case "manager":
          return "Manager";
        case "withdrawal":
          return "Withdrawal";
        case "auditor":
          return "Auditor";
        case "createid":
        case "createID":
          return "CreateID";
        default:
          return role;
      }
    });

    const newUser = new UserManagement({
      profileName,
      userId: userObjectId,
      password: hashedPassword, // Use hashed password
      roles: formattedRoles,
    });

    await newUser.save();

    const responseUser = {
      _id: newUser._id,
      profileName: newUser.profileName,
      userId: newUser.userId,
      roles: newUser.roles,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      message: "User created successfully",
      user: responseUser,
    });
  } catch (err) {
    console.error("Create team user error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getAllTeamUsers = async (req, res) => {
  try {
    const teamUsers = await UserManagement.find()
      .populate("userId", "name lastLoginIp")
      .select("-password");
    res.status(200).json({ users: teamUsers });
  } catch (err) {
    console.error("Get team users error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const updateUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roles } = req.body;

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const updatedUser = await UserManagement.findOneAndUpdate(
      { userId: userObjectId },
      { roles: roles },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Team user not found" });
    }

    res.status(200).json({
      message: "User roles updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user roles error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const deleteTeamUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Try to find and delete the user document where userId matches
    const deletedUser = await UserManagement.findOneAndDelete({
      userId: userObjectId,
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "Team user not found" });
    }

    return res.status(200).json({
      message: "Team user deleted successfully",
      deletedUser: deletedUser.profileName,
    });
  } catch (err) {
    console.error("Delete team user error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getCurrentUserRoles = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the UserManagement record for the current user
    const userManagement = await UserManagement.findOne({ userId })
      .select("roles profileName")
      .populate("userId", "name email role");

    if (!userManagement) {
      return res.status(200).json({
        hasUserManagement: false,
        roles: [],
        profileName: null,
        userInfo: {
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    }

    res.status(200).json({
      hasUserManagement: true,
      roles: userManagement.roles || [],
      profileName: userManagement.profileName,
      userInfo: {
        name: userManagement.userId?.name || req.user.name,
        email: userManagement.userId?.email || req.user.email,
        role: userManagement.userId?.role || req.user.role,
      },
    });
  } catch (err) {
    console.error("Get current user roles error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  createTeamUser,
  getAllTeamUsers,
  updateUserRoles,
  deleteTeamUser,
  getCurrentUserRoles,
};
