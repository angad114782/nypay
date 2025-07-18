const Withdraw = require("../models/Withdraw");
const User = require("../models/User");


// ✅ Create withdraw request
exports.requestWithdraw = async (req, res) => {
  try {
    const { amount, withdrawMethod, selectedAccount } = req.body;

    const newWithdraw = new Withdraw({
      userId: req.user._id,
      amount,
      withdrawMethod,
      selectedAccount,
    });

    await newWithdraw.save();

    res.status(201).json({
      success: true,
      message: "Withdraw request submitted",
      withdraw: newWithdraw,
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all withdraws
exports.getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 }).populate("userId", "name email");
    const formatted = withdraws.map((dep) => ({
      id: dep._id,
      profileName: dep.userId?.name || "N/A",
      userName: dep.userId?.email || "N/A",
      amount: dep.amount,
      paymentType: dep.paymentMethod,
      selectedAccount: dep.selectedAccount,
      withdrawMethod: dep.withdrawMethod,
      // utr: dep.utr,
      // 🔥 Convert filename into full URL
      // screenshotUrl: dep.screenshot,
      entryDate: new Date(dep.createdAt).toLocaleString(),
      status: dep.status,
      remark: dep.remark || "",
      parentIp: dep.userId?.lastLoginIp || "N/A",
    }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch withdraws" });
  }
};

exports.updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id, "id");
    console.log(status, "status");


    console.log("📥 Incoming status:", status, "for withdrawalId:", withdrawalId);

    // 🔁 Normalize status
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
      console.log("❌ Invalid status input");
      return res.status(400).json({ message: "Invalid status" });
    }

    const withdrawal = await Withdraw.findById(withdrawalId);
    if (!withdrawal) {
      console.log("❌ Withdrawal not found for ID:", withdrawalId);
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    // ✅ Deduct wallet on first approval only
    if (status === "Approved" && withdrawal.status !== "Approved") {
      const user = await User.findById(withdrawal.userId);
      if (!user) {
        console.log("❌ User not found for withdrawal:", withdrawal.userId);
        return res.status(404).json({ message: "User not found" });
      }

      if ((user.wallet || 0) < withdrawal.amount) {
        console.log("❌ Insufficient wallet balance");
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      user.wallet -= withdrawal.amount;
      await user.save();
      console.log("💸 Wallet deducted. New balance:", user.wallet);
    } else {
      console.log("⚠️ Wallet not deducted. Already approved or not valid for deduction.");
    }

    // 💾 Update withdrawal status
    withdrawal.status = status;
    await withdrawal.save();

    console.log("✅ Withdrawal status updated:", status);
    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("🔥 Withdrawal Status Update Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📝 Admin: Update Withdrawal Remark Only
exports.updateWithdrawalRemark = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { remark } = req.body;
    const withdrawal = await Withdraw.findById(withdrawalId);

    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });

    withdrawal.remark = remark || "";
    await withdrawal.save();

    res.status(200).json({ success: true, message: "Remark updated successfully" });
  } catch (err) {
    console.error("Remark Update Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
