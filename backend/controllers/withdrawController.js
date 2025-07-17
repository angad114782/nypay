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

    res.status(201).json({ success: true, message: "Withdraw request submitted", withdraw: newWithdraw });
  } catch (error) {
    console.error("Withdraw Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all withdraws
exports.getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().populate("userId", "name email");
    res.status(200).json({ success: true, withdraws });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch withdraws" });
  }
};

// ✅ Update withdraw status only
exports.updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Withdraw.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({ success: true, message: "Status updated", withdraw: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// ✅ Update withdraw remark only
exports.updateWithdrawRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    const updated = await Withdraw.findByIdAndUpdate(id, { remark }, { new: true });

    res.status(200).json({ success: true, message: "Remark updated", withdraw: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update remark" });
  }
};
