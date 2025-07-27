const UserGameId = require("../models/UserGameId");
const Panel = require("../models/Panel");
const Passbook = require("../models/Passbook");

const createGameId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, password, type, panelId } = req.body;

    if (!username || !password || !type || !panelId) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, password, type, panelId) are required",
      });
    }

    // 🔍 Fetch Panel Info
    const panel = await Panel.findById(panelId);
    if (!panel) {
      return res
        .status(404)
        .json({ success: false, message: "Panel not found" });
    }

    // ✅ Create Game ID
    const newGameId = new UserGameId({
      userId,
      username,
      password,
      type,
      panelId,
    });

    await newGameId.save();

    // 🧾 Log in Passbook (no wallet deduction, just record)
    const passbookEntry = new Passbook({
      userId,
      type: "game-id",
      direction: "debit", // 👈 semantic only, not actual wallet deduction
      amount: 0,
      balance: 0, // since no wallet impact
      description: `Game ID created for panel: ${panel.profileName}`,
    });

    await passbookEntry.save();

    res.status(201).json({
      success: true,
      message: "Game ID created successfully",
      gameId: newGameId,
    });
  } catch (error) {
    console.error("❌ Game ID Creation Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getMyGameIds = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const gameIds = await UserGameId.find({
      userId: req.user._id,
      isBlocked: { $ne: true },
    })
      .populate("panelId", "profileName logo userId isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, gameIds });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// ✅ Admin: Get all Game ID requests
const getAllGameIdRequests = async (req, res) => {
  try {
    const gameIds = await UserGameId.find()
      .populate("userId", "name email phone") // ✅ Optional: show user info
      .populate("panelId", "gameName gameLogo gameUrl profileName userId") // ✅ Panel info
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, gameIds });
  } catch (error) {
    console.error("❌ Admin Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateGameId = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const updated = await UserGameId.findByIdAndUpdate(
      id,
      {
        ...(username && { username }),
        ...(password && { password }),
      },
      { new: true }
    ).populate("panelId", "gameName gameLogo gameUrl profileName");

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Game ID not found" });
    }

    res.json({
      success: true,
      message: "Username/Password updated",
      gameId: updated,
    });
  } catch (err) {
    console.error("❌ Error updating Game ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const closeGameId = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await UserGameId.findByIdAndUpdate(
      id,
      { status: "Closed" },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Game ID not found" });
    }

    res.json({ success: true, message: "Game ID closed", gameId: updated });
  } catch (err) {
    console.error("❌ Error closing Game ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteGameId = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserGameId.findByIdAndDelete(id).populate(
      "panelId",
      "gameName"
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Game ID not found" });
    }

    res.json({
      success: true,
      message: "Game ID deleted successfully",
      gameId: deleted,
    });
  } catch (err) {
    console.error("❌ Error deleting Game ID:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const changeGameIdStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!["Active", "Rejected", "Pending", "Closed"].includes(status))
//       return res.status(400).json({ success: false, message: "Invalid status" });

//     const gameId = await UserGameId.findById(id).populate("panelId", "gameName");
//     if (!gameId)
//       return res.status(404).json({ success: false, message: "Game ID not found" });

//     gameId.status = status;
//     await gameId.save();

//     res.status(200).json({ success: true, message: `Status updated to ${status}`, updated: gameId });
//   } catch (error) {
//     console.error("❌ Status Error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// const updateGameIdRemark = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { remark } = req.body;

//     const gameId = await UserGameId.findById(id).populate("panelId", "gameName");
//     if (!gameId) return res.status(404).json({ success: false, message: "Game ID not found" });

//     // ✅ Allow admin to update remark directly
//     gameId.remark = remark;
//     await gameId.save();

//     res.status(200).json({ success: true, message: "Remark updated", updated: gameId });
//   } catch (error) {
//     console.error("❌ Remark Error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// PATCH /api/game/block-toggle/:id
const toggleGameIdBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const updated = await UserGameId.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error("❌ Error toggling block:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const changeGameIdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark = "" } = req.body;

    // ✅ Only allow these statuses
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // ✅ Get the game ID
    const gameId = await UserGameId.findById(id);
    if (!gameId) {
      return res.status(404).json({
        success: false,
        message: "Game ID not found",
      });
    }

    // ❌ Reject if status already changed
    if (gameId.status !== "Pending") {
      return res.status(403).json({
        success: false,
        message: "Status already updated",
      });
    }

    // ✅ Update status and remark
    gameId.status = status;
    gameId.remark = remark;
    await gameId.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      updated: gameId,
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createGameId,
  getMyGameIds,
  getAllGameIdRequests,
  updateGameId,
  closeGameId,
  deleteGameId,
  changeGameIdStatus,
  // updateGameIdRemark,
  toggleGameIdBlock,
};
