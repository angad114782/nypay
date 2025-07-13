const Upi = require("../models/Upi");

// Add UPI
const createUpi = async (req, res) => {
  try {
    const { upiName, upiId } = req.body;

    if (!upiName || !upiId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Upi.findOne({ upiId });
    if (exists) {
      return res.status(400).json({ message: "UPI ID already exists" });
    }

    const newUpi = await Upi.create({ upiName, upiId });
    res.status(201).json({ message: "UPI added successfully", upi: newUpi });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// List all UPIs
const listUpis = async (req, res) => {
  try {
    const upis = await Upi.find().sort({ createdAt: -1 });
    res.json({ upis });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch UPIs", error });
  }
};

// Update UPI
const updateUpi = async (req, res) => {
  try {
    const { id } = req.params;
    const { upiName, upiId, status } = req.body;

    const updated = await Upi.findByIdAndUpdate(
      id,
      { upiName, upiId, status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "UPI not found" });

    res.json({ message: "UPI updated", upi: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update UPI", error });
  }
};

// Delete UPI
const deleteUpi = async (req, res) => {
  try {
    const { id } = req.params;
    await Upi.findByIdAndDelete(id);
    res.json({ message: "UPI deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete UPI", error });
  }
};

module.exports = {
  createUpi,
  listUpis,
  updateUpi,
  deleteUpi,
};
