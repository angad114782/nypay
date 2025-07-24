const Withdraw = require("../models/Withdraw");
const User = require("../models/User");
const Passbook = require("../models/Passbook");

// ✅ Create withdraw request
exports.requestWithdraw = async (req, res) => {
  try {
    const { amount, withdrawMethod, selectedAccount } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newWithdraw = new Withdraw({
      userId: user._id,
      amount,
      withdrawMethod,
      selectedAccount,
    });

    await newWithdraw.save();

    // 💳 Create passbook entry (Pending doesn't deduct yet)
    await Passbook.create({
      userId: user._id,
      type: "withdraw",
      direction: "debit",
      amount,
      balance: user.wallet, // Balance remains same at request
      description: `Withdrawal of ₹${amount} requested via ${withdrawMethod}`,
    });

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
    const withdraws = await Withdraw.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
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

// exports.updateWithdrawStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let { status } = req.body;

//     // 🔁 Normalize status
//     const statusMap = {
//       pending: "Pending",
//       approve: "Approved",
//       approved: "Approved",
//       completed: "Approved",
//       reject: "Rejected",
//       rejected: "Rejected",
//       rejact: "Rejected",
//       rejacted: "Rejected",
//     };

//     status = statusMap[status?.toLowerCase()] || null;

//     if (!status) {
//       // console.log("❌ Invalid status input");
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const withdrawal = await Withdraw.findById(id);
//     if (!withdrawal) {
//       // console.log("❌ Withdrawal not found for ID:", id);
//       return res.status(404).json({ message: "Withdrawal not found" });
//     }

//     // ✅ Deduct wallet on first approval only
//     if (status === "Approved" && withdrawal.status !== "Approved") {
//       const user = await User.findById(withdrawal.userId);
//       if (!user) {
//         // console.log("❌ User not found for withdrawal:", withdrawal.userId);
//         return res.status(404).json({ message: "User not found" });
//       }

//       if ((user.wallet || 0) < withdrawal.amount) {
//         // console.log("❌ Insufficient wallet balance");
//         return res.status(400).json({ message: "Insufficient wallet balance" });
//       }

//       user.wallet -= withdrawal.amount;
//       await user.save();
//       // console.log("💸 Wallet deducted. New balance:", user.wallet);
//     } else {
//       // console.log("⚠️ Wallet not deducted. Already approved or not valid for deduction.");
//     }

//     // 💾 Update withdrawal status
//     withdrawal.status = status;
//     await withdrawal.save();

//     // console.log("✅ Withdrawal status updated:", status);
//     return res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//       withdraw: withdrawal,
//     });
//   } catch (err) {
//     console.error("🔥 Withdrawal Status Update Error:", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ✅ Update withdraw remark only
// exports.updateWithdrawRemark = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { remark } = req.body;

//     const updated = await Withdraw.findByIdAndUpdate(
//       id,
//       { remark },
//       { new: true }
//     );

//     res
//       .status(200)
//       .json({ success: true, message: "Remark updated", withdraw: updated });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to update remark" });
//   }
// };

// ✅ Combined: Update Withdraw Status and Remark
exports.updateWithdrawStatus = async (req, res) => {
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

    // ✅ Get the withdraw
    const withdrawal = await Withdraw.findById(id);
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    // ✅ Deduct wallet on first approval only
    if (status === "Approved" && withdrawal.status !== "Approved") {
      const user = await User.findById(withdrawal.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if ((user.wallet || 0) < withdrawal.amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance",
        });
      }

      user.wallet -= withdrawal.amount;
      await user.save();
    }

    // ✅ Update status and remark
    withdrawal.status = status;
    withdrawal.remark = remark;
    await withdrawal.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      updated: withdrawal,
    });
  } catch (error) {
    console.error("❌ Error updating withdrawal status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
