const Deposit = require("../models/Deposit");

exports.createDeposit = async (req, res) => {
  try {
    const { amount, paymentMethod, utr } = req.body;
    const screenshotPath = req.file?.path;

    if (!amount || !paymentMethod || !utr || !screenshotPath) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
