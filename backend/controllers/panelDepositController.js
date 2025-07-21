const PanelDeposit = require("../models/PanelDeposit");
const User = require("../models/User");
const UserGameId = require("../models/UserGameId");
const Passbook = require("../models/Passbook");

exports.createPanelDeposit = async (req, res) => {
  try {
    const { amount, panelId } = req.body;

    if (!amount || amount < 500) {
      return res.status(400).json({ error: "Minimum deposit is 500 coins." });
    }

    if (!panelId) {
      return res.status(400).json({ error: "Panel ID is required." });
    }

    const deposit = new PanelDeposit({
      userId: req.user.id,
      panelId,
      amount,
    });

    await deposit.save();

    // 🧾 Add to Passbook (Pending status)
    await Passbook.create({
      userId: req.user.id,
      type: "panel-deposit",
      direction: "credit",
      amount,
      balance: (await User.findById(req.user.id)).wallet || 0, // no wallet update yet
      description: `Panel Deposit of ₹${amount} requested (Panel ID: ${panelId})`,
      status: "Pending",
      linkedId: deposit._id, // optional: for traceability
    });

    res.status(200).json({ message: "Deposit request submitted." });
  } catch (err) {
    console.error("Deposit Error:", err);
    res.status(500).json({ error: "Server error." });
  }
};



exports.getAllPanelDeposits = async (req, res) => {
    try {
        const deposits = await PanelDeposit.find()
            .populate("userId", "name email") // Optional
            .populate("panelId", "profileName") // Optional
            .sort({ requestedAt: -1 });

        // Add username from usergameid
        const enriched = await Promise.all(
            deposits.map(async (deposit) => {
                const userGame = await UserGameId.findOne({
                    userId: deposit.userId._id,
                    panelId: deposit.panelId._id,
                    status: "Active",
                });

                return {
                    ...deposit.toObject(),
                    gameIdInfo: userGame ? {
                        username: userGame.username,
                        password: userGame.password,
                        status: userGame.status,
                    } : null,
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
            return res.status(400).json({ message: "Invalid status" });
        }

        const deposit = await PanelDeposit.findById(id);
        if (!deposit) {
            return res.status(404).json({ message: "Deposit not found" });
        }

        // ✅ Only credit wallet if approving for the first time
        if (status === "Approved" && deposit.status !== "Approved") {
            // 🔍 Get userId from UserGameId
            const gameId = await UserGameId.findById(deposit.gameIdId);
            if (!gameId) {
                return res.status(404).json({ message: "Game ID not found" });
            }

            const user = await User.findById(gameId.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.wallet = (user.wallet || 0) + deposit.amount;
            await user.save();
        }

        // 💾 Update deposit
        deposit.status = status;
        deposit.remark = remark;
        deposit.statusUpdatedAt = new Date();
        await deposit.save();

        return res.status(200).json({ message: "Deposit status updated.", deposit });
    } catch (err) {
        console.error("🔥 Status Update Error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};