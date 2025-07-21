const PanelWithdraw = require("../models/PanelWithdraw");
const User = require("../models/User");
const Passbook = require("../models/Passbook");
const UserGameId = require("../models/UserGameId");

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

    // 🧾 Create withdrawal request
    user.coins -= amount;
    await user.save();

    const withdraw = new PanelWithdraw({
      userId: req.user.id,
      panelId,
      amount,
    });

    await withdraw.save();

    // 📘 Log in Passbook
    await Passbook.create({
      userId: req.user.id,
      type: "panel-withdraw",
      direction: "debit",
      amount,
      balance: user.coins, // updated balance after deduction
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


exports.updatePanelWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, remark } = req.body;

    // 🔁 Normalize status input
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

    if (!status) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const withdraw = await PanelWithdraw.findById(id);
    if (!withdraw) {
      return res.status(404).json({ error: "Withdraw request not found." });
    }

    // ✅ Deduct wallet only if approving for first time
    if (status === "Approved" && withdraw.status !== "Approved") {
      const gameId = await UserGameId.findById(withdraw.gameIdId);
      if (!gameId) {
        return res.status(404).json({ error: "Game ID not found" });
      }

      const user = await User.findById(gameId.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if ((user.wallet || 0) < withdraw.amount) {
        return res.status(400).json({ error: "Insufficient wallet balance." });
      }

      user.wallet -= withdraw.amount;
      await user.save();
    }

    // 💾 Update withdrawal
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
