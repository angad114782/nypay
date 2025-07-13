const Bank = require("../models/Bank");

exports.addBank = async (req, res) => {
  try {
    const {bankName, accountHolder, accountNumber, ifscCode } = req.body;

    if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newBank = new Bank({
      userId: req.user._id,
      bankName,
      accountHolder,
      accountNumber,
      ifscCode,
    });

    await newBank.save();
    res.status(201).json({ message: "Bank details added", bank: newBank });
  } catch (err) {
    console.error("Add Bank Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBanks = async (req, res) => {
  try {
    const banks = await Bank.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ banks });
  } catch (err) {
    console.error("Get Banks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Edit bank details
exports.updateBank = async (req, res) => {
  try {
    const bank = await Bank.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bank) return res.status(404).json({ message: "Bank not found" });

    const { bankName, accountHolder, accountNumber, ifscCode } = req.body;

    bank.bankName = bankName || bank.bankName;
    bank.accountHolder = accountHolder || bank.accountHolder;
    bank.accountNumber = accountNumber || bank.accountNumber;
    bank.ifscCode = ifscCode || bank.ifscCode;

    await bank.save();
    res.status(200).json({ message: "Bank updated", bank });
  } catch (error) {
    console.error("Update Bank Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete bank
exports.deleteBank = async (req, res) => {
  try {
    const bank = await Bank.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!bank) return res.status(404).json({ message: "Bank not found or already deleted" });
    res.status(200).json({ message: "Bank deleted" });
  } catch (error) {
    console.error("Delete Bank Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
