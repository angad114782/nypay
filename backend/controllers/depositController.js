const Deposit = require("../models/Deposit");
const User = require("../models/User");

exports.createDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod, utr } = req.body;
    const screenshotPath = req.file
      ? `/uploads/upi_qr/${req.file.filename}`
      : null;

    if (!amount || !paymentMethod || !utr || !screenshotPath) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDeposit = new Deposit({
      userId: req.user._id,
      amount,
      paymentMethod,
      utr,
      screenshot: screenshotPath,
    });

    await newDeposit.save();

    // Save deposit to database logic here (example)
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
      .populate("userId", "name email phone lastLoginIp");

    const formatted = deposits.map((dep) => ({
      id: dep._id,
      profileName: dep.userId?.name || "N/A",
      userName: dep.userId?.email || "N/A",
      amount: dep.amount,
      paymentType: dep.paymentMethod,
      utr: dep.utr,
      // 🔥 Convert filename into full URL
      screenshotUrl: dep.screenshot
        ? `${req.protocol}://${req.get("host")}/uploads/${dep.screenshot}`
        : null,
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


// ✅ Separate: Update Status Only
exports.updateDepositStatus = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const deposit = await Deposit.findById(depositId);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    deposit.status = status;
    await deposit.save();

    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Separate: Update Remark Only
exports.updateDepositRemark = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { remark } = req.body;

    const deposit = await Deposit.findById(depositId);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    deposit.remark = remark || "";
    await deposit.save();

    res.status(200).json({ success: true, message: "Remark updated successfully" });
  } catch (err) {
    console.error("Remark Update Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};