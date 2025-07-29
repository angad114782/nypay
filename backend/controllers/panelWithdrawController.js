const PanelWithdraw = require("../models/PanelWithdraw");
const User = require("../models/User");
const Passbook = require("../models/Passbook");
const UserGameId = require("../models/UserGameId");

// ✅ CREATE Withdraw Request (Deduct coins, log in Passbook)
exports.createPanelWithdraw = async (req, res) => {
  try {
    const { amount, panelId } = req.body;

    if (!amount || amount < 1200) {
      return res.status(400).json({ error: "Minimum withdrawal is 1200 coins." });
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
    });

    // 🧾 Log in Passbook
    await Passbook.create({
      userId: req.user.id,
      type: "panel-withdraw",
      direction: "debit",
      amount,
      balance: Number(user?.coins) || 0, // ✅ ensure a valid number
      description: `Panel Withdraw request of ₹${amount} (Panel ID: ${panelId})`,
      status: "Pending",
      linkedId: withdraw._id,
    });


    res.status(200).json({ message: "Withdrawal request submitted." });
  } catch (err) {
    console.error("Withdrawal Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET All Withdraw Requests
exports.getAllPanelWithdraws = async (req, res) => {
  try {
    const withdraws = await PanelWithdraw.find()
      .populate("userId", "name email")
      .populate("panelId", "profileName")
      .sort({ requestedAt: -1 });

    const enriched = await Promise.all(
      withdraws.map(async (withdraw) => {
        const userGame = await UserGameId.findOne({
          userId: withdraw.userId._id,
          panelId: withdraw.panelId._id,
          status: "Active",
        });

        return {
          ...withdraw.toObject(),
          gameIdInfo: userGame
            ? {
              username: userGame.username,
              password: userGame.password,
              status: userGame.status,
            }
            : null,
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
    let { status, remark } = req.body;

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
    if (!status) return res.status(400).json({ error: "Invalid status value." });

    const withdraw = await PanelWithdraw.findById(id);
    if (!withdraw) return res.status(404).json({ error: "Withdraw request not found." });

    // ✅ Credit wallet if approving for the first time
    if (status === "Approved" && withdraw.status !== "Approved") {
      const gameId = await UserGameId.findOne({ panelId: withdraw.panelId });
      if (!gameId) return res.status(404).json({ error: "Game ID not found" });

      const user = await User.findById(gameId.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.wallet = (user.wallet || 0) + withdraw.amount;
      await user.save();

      // 🧾 Log passbook for approval credit
      await Passbook.create({
        userId: user._id,
        type: "panel-withdraw",
        direction: "credit",
        amount: withdraw.amount,
        balance: user.wallet,
        description: `₹${withdraw.amount} withdrawn from panel credited to wallet (Panel ID: ${withdraw.panelId})`,
        status: "Success",
        linkedId: withdraw._id,
      });
    }

    // 💾 Save status & remark
    withdraw.status = status;
    withdraw.remark = remark;
    withdraw.statusUpdatedAt = new Date();
    await withdraw.save();

    res.status(200).json({ message: "Withdrawal status updated.", withdraw });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ error: "Failed to update withdrawal status." });
  }
};
