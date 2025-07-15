const Bank = require("../models/AdminBank");

exports.addBank = async (req, res) => {
  try {
    const { bankName, accountHolder, accountNumber, ifscCode } = req.body;

    if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Set all existing banks for this user to inactive
    await Bank.updateMany({ userId: req.user._id }, { $set: { status: "inactive" } });

    // ✅ Create new active bank
    const newBank = new Bank({
      userId: req.user._id,
      bankName,
      accountHolder,
      accountNumber,
      ifscCode,
      status: "active", // explicitly mark new one as active
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


exports.setActiveBank = async (req, res) => {
  try {
    const { bankId } = req.params;

    // 1. Deactivate all banks of the user
    await Bank.updateMany({ userId: req.user._id }, { status: "inactive" });

    // 2. Activate the selected bank
    const updatedBank = await Bank.findOneAndUpdate(
      { _id: bankId, userId: req.user._id },
      { status: "active" },
      { new: true }
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.json({ message: "Bank set to active", bank: updatedBank });
  } catch (error) {
    console.error("Set Active Bank Error:", error);
    res.status(500).json({ message: "Failed to update bank status", error });
  }
};

exports.getActiveBankForUser = async (req, res) => {
  try {
    const bank = await Bank.findOne({ userId: null, status: "active" }); // Admin Bank
    if (!bank) return res.status(404).json({ message: "No active bank found" });
    res.json({ bank });
  } catch (error) {
    console.error("Get Active Bank Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
