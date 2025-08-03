const PanelDeposit = require("../models/PanelDeposit");
const User = require("../models/User");
const UserGameId = require("../models/UserGameId");
const Passbook = require("../models/Passbook");

exports.createPanelDeposit = async (req, res) => {
  try {
    const { amount, panelId , gameUsername } = req.body;

    if (!amount || amount < 500) {
      return res.status(400).json({ error: "Minimum deposit is 500 coins." });
    }

    if (!panelId) {
      return res.status(400).json({ error: "Panel ID is required." });
    }

    // ✅ Check wallet balance
    const user = await User.findById(req.user.id);
    if (!user || Number(user.wallet) < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance." });
    }

    // 📝 Save deposit request
    const deposit = new PanelDeposit({
      userId: req.user.id,
      panelId,
      amount,
      gameUsername,
    });

    await deposit.save();

    // 🧾 Add to Passbook (Pending status)
    await Passbook.create({
      userId: req.user.id,
      type: "panel-deposit",
      direction: "credit",
      amount,
      balance: Number(user.wallet),
      panelId: panelId, // ✅ Correct
      description: `Panel Deposit of ₹${amount} requested (Panel ID: ${gameUsername})`,
      status: "Pending",
      linkedId: deposit._id,
    });

    res.status(200).json({ message: "Deposit request submitted.",gameUsername });
  } catch (err) {
    console.error("Deposit Error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

exports.getAllPanelDeposits = async (req, res) => {
  try {
    const deposits = await PanelDeposit.find()
      .populate("userId", "name email lastLoginIp wallet")
      .populate("panelId", "profileName")
      .sort({ requestedAt: -1 })
      .lean(); // ✅ use lean for performance

    const enriched = await Promise.all(
      deposits.map(async (deposit) => {
        let gameId = null;

        // Optional: enrich with full game ID info
        if (deposit.userId?._id && deposit.panelId?._id) {
          const userGame = await UserGameId.findOne({
            userId: deposit.userId._id,
            panelId: deposit.panelId._id,
          }).lean();

          if (userGame) {
            gameId = {
              username: userGame.username,
              password: userGame.password,
              status: userGame.status,
            };
          }
        }

        return {
          ...deposit,
          gameUsername: deposit.gameUsername || gameId?.username || null, // ✅ prefer saved username
          gameId, // ✅ extra full object for UI or admin panel
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error("Fetch Deposit Error:", err);
    res.status(500).json({ error: "Failed to fetch deposits." });
  }
};


exports.updatePanelDepositStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, remark = "" } = req.body;

    // ✅ Validate required fields
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "ID and status are required.",
      });
    }

    // 🔁 Normalize and validate status
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

    status = statusMap[status?.toLowerCase()] || null;
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    // 🔍 Find the panel deposit
    const deposit = await PanelDeposit.findById(id);
    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit request not found.",
      });
    }

    // 💰 Deduct wallet if first-time approval
    if (status === "Approved" && deposit.status !== "Approved") {
      const gameId = await UserGameId.findOne({ panelId: deposit.panelId });
      if (!gameId) {
        return res.status(404).json({
          success: false,
          message: "Game ID not found for panel.",
        });
      }

      const user = await User.findById(deposit.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      user.wallet = (user.wallet || 0) - deposit.amount;

      // Prevent negative balance
      if (user.wallet < 0) user.wallet = 0;

      await user.save();
    }

    // 💾 Update deposit status and remark
    deposit.status = status;
    deposit.remark = remark;
    deposit.statusUpdatedAt = new Date();
    await deposit.save();

    return res.status(200).json({
      success: true,
      message: "Panel deposit status updated successfully.",
      updated: deposit,
    });
  } catch (error) {
    console.error("❌ Error updating panel deposit status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
