const Withdraw = require("../models/Withdraw");

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
    const withdraws = await Withdraw.find().populate("userId", "name email");
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

// ✅ Update withdraw status only
exports.updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Withdraw.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Status updated", withdraw: updated });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update status" });
  }
};

// ✅ Update withdraw remark only
exports.updateWithdrawRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    const updated = await Withdraw.findByIdAndUpdate(
      id,
      { remark },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Remark updated", withdraw: updated });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update remark" });
  }
};
