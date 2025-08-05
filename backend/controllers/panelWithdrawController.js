const PanelWithdraw = require("../models/PanelWithdraw");
const User = require("../models/User");
const Passbook = require("../models/Passbook");
const UserGameId = require("../models/UserGameId");

// ✅ CREATE Withdraw Request (Deduct coins, log in Passbook)
exports.createPanelWithdraw = async (req, res) => {
  try {
    const { amount, panelId, gameUsername } = req.body;

    if (!amount || amount < 500) {
      return res
        .status(400)
        .json({ error: "Minimum withdrawal is 500 coins." });
    }

    if (!panelId) {
      return res.status(400).json({ error: "Panel ID is required." });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.coins < amount) {
      return res.status(400).json({ error: "Insufficient coin balance." });
    }

    // 💸 Deduct coins from user
    user.coins -= amount;
    await user.save();

    // 📄 Create withdraw record
    const withdraw = await PanelWithdraw.create({
      userId: req.user.id,
      panelId,
      amount,
      gameUsername,
    });

    // 🧾 Log in Passbook
    await Passbook.create({
      userId: req.user.id,
      type: "panel-withdraw",
      direction: "debit",
      amount,
      balance: Number(user?.coins) || 0,
      description: `Panel Withdraw request of ₹${amount} (Panel ID: ${gameUsername})`,
      status: "Pending",
      panelId: panelId,
      linkedId: withdraw._id,
    });

    
  if (req.app.get("io")) {
      req.app.get("io").emit("panel-withdrawal-created", {
          id: withdraw._id,
        userId: withdraw.userId,
        amount,
        status: "Pending",
        panelId,
        gameUsername,
      });
    }

    res.status(200).json({ message: "Withdrawal request submitted." });
  } catch (err) {
    console.error("Withdrawal Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getAllPanelWithdraws = async (req, res) => {
  try {
    const withdraws = await PanelWithdraw.find()
      .populate("userId", "name email lastLoginIp wallet")
      .populate("panelId", "profileName")
      .sort({ requestedAt: -1 })
      .lean(); // improve performance by returning plain JS objects

    const enriched = await Promise.all(
      withdraws.map(async (withdraw) => {
        let gameIdInfo = null;

        if (withdraw.userId?._id && withdraw.panelId?._id) {
          const userGame = await UserGameId.findOne({
            userId: withdraw.userId._id,
            panelId: withdraw.panelId._id,
            status: "Active",
          }).lean();

          if (userGame) {
            gameIdInfo = {
              username: userGame.username,
              password: userGame.password,
              status: userGame.status,
            };
          }
        }

        return {
          ...withdraw,
          gameUsername: withdraw.gameUsername || gameIdInfo?.username || null, // ✅ prefer saved one
          gameIdInfo, // ✅ optional extra info
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Fetch Withdraw Error:", err);
    res.status(500).json({ error: "Failed to fetch withdrawals." });
  }
};


// ✅ UPDATE Withdraw Status (Add wallet on approval)
exports.updatePanelWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, remark = "" } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "ID and status are required.",
      });
    }

    const statusMap = {
      pending: "Pending",
      approve: "Approved",
      approved: "Approved",
      completed: "Approved",
      reject: "Rejected",
      rejected: "Rejected",
      rejact: "Rejected",
      rejacted: "Rejected",
    };

    status = statusMap[status.toLowerCase()] || null;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const withdraw = await PanelWithdraw.findById(id);
    if (!withdraw) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal request not found.",
      });
    }

    if (status === "Approved" && withdraw.status !== "Approved") {
      const gameId = await UserGameId.findOne({ panelId: withdraw.panelId });
      if (!gameId) {
        return res.status(404).json({
          success: false,
          message: "Game ID not found for panel.",
        });
      }

      const user = await User.findById(withdraw.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      user.wallet = (user.wallet || 0) + withdraw.amount;
      await user.save();
    }

    withdraw.status = status;
    withdraw.remark = remark;
    withdraw.statusUpdatedAt = new Date();
    await withdraw.save();


      if (req.app.get("io")) {
      req.app.get("io").emit("panel-withdrawal-status-updated", {
        id: withdraw._id,
        userId: withdraw.userId,
        status,
        remark,
      });
    }

    res.status(200).json({
      success: true,
      message: "Panel withdrawal status updated successfully.",
      updated: withdraw,
    });
  } catch (error) {
    console.error("❌ Error updating panel withdrawal status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};