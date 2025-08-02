const Deposit = require("../models/Deposit");
const User = require("../models/User");
const Passbook = require("../models/Passbook");
exports.createDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod, utr } = req.body;
    const screenshotPath = req.file
      ? `/uploads/deposits/${req.file.filename}`
      : null;

    if (!amount || !paymentMethod || !utr || !screenshotPath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check for duplicate UTR
    const existingUTR = await Deposit.findOne({ utr });
    if (existingUTR) {
      return res
        .status(400)
        .json({ message: "This UTR has already been used. Please check again." });
    }

    const newDeposit = new Deposit({
      userId: req.user._id,
      amount,
      paymentMethod,
      utr,
      screenshot: screenshotPath,
    });

    await newDeposit.save();

    // 🧾 Create Passbook Entry (pending deposit request)
    const user = await User.findById(req.user._id);

    await Passbook.create({
      userId: req.user._id,
      type: "deposit",
      direction: "credit",
      amount,
      balance: user.wallet || 0,
      description: `Deposit of ₹${amount} requested via ${paymentMethod} (UTR: ${utr})`,
      linkedId: newDeposit._id, // ✅ Add this
    });



    res.status(201).json({
      message: "Deposit submitted successfully",
      data: {
        amount,
        paymentMethod,
        utr,
        screenshot: screenshotPath,
        user: req.user._id,
      },
    });
  } catch (err) {
    console.error("Deposit Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone lastLoginIp wallet");

    const formatted = deposits.map((dep) => ({
      id: dep._id,
      profileName: dep.userId?.name || "N/A",
      userName: dep.userId?.email || "N/A",
      wallet: dep.userId?.wallet || 0,
      amount: dep.amount,
      paymentType: dep.paymentMethod,
      utr: dep.utr,
      // 🔥 Convert filename into full URL
      screenshotUrl: dep.screenshot,
      entryDate: new Date(dep.createdAt).toLocaleString(),
      status: dep.status,
      remark: dep.remark || "",
      parentIp: dep.userId?.lastLoginIp || "N/A",
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Fetch Deposits Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// exports.updateDepositStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, remark = "" } = req.body;

//     // 🔁 Normalize status input
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
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const deposit = await Deposit.findById(id);
//     if (!deposit) {
//       return res.status(404).json({ message: "Deposit not found" });
//     }

//     // ✅ Only update wallet if this is the first approval
//     if (status === "Approved" && deposit.status !== "Approved") {
//       const user = await User.findById(deposit.userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       user.wallet = (user.wallet || 0) + deposit.amount;
//       await user.save();
//     } else {
//     }

//     // 💾 Update deposit status
//     deposit.status = status;
//     await deposit.save();

//     return res
//       .status(200)
//       .json({ success: true, message: "Status updated successfully" });
//   } catch (err) {
//     console.error("🔥 Status Update Error:", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

exports.getMyWalletBalance = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, balance: user.wallet || 0 });
  } catch (err) {
    console.error("Wallet Fetch Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// // ✅ Separate: Update Remark Only
// exports.updateDepositRemark = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { remark } = req.body;

//     await Deposit.findByIdAndUpdate(id, { remark }, { new: true });

//     res
//       .status(200)
//       .json({ success: true, message: "Remark updated successfully" });
//   } catch (err) {
//     console.error("Remark Update Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

exports.updateDepositStatus = async (req, res) => {
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

    // ✅ Get the deposit
    const deposit = await Deposit.findById(id);
    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    // ✅ Only update wallet if this is the first approval
    if (status === "Approved" && deposit.status !== "Approved") {
      const user = await User.findById(deposit.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.wallet = (user.wallet || 0) + deposit.amount;
      await user.save();
    }

    // ✅ Update status and remark
    deposit.status = status;
    deposit.remark = remark;
    await deposit.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      updated: deposit,
    });
  } catch (error) {
    console.error("❌ Error updating deposit status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
