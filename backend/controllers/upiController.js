const Upi = require("../models/Upi");

const createUpi = async (req, res) => {
  try {
    const { upiName, upiId } = req.body;

    if (!upiName || !upiId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Upi.findOne({ upiId, userId: req.user._id });
    if (exists) {
      return res.status(400).json({ message: "This UPI ID already exists for your account" });
    }

    const newUpi = await Upi.create({
      userId: req.user._id,
      upiName,
      upiId,
    });

    res.status(201).json({ message: "UPI added successfully", upi: newUpi });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// List all UPIs
const listUpis = async (req, res) => {
  try {
    const upis = await Upi.find({ userId: req.user._id }).sort({ createdAt: -1 });
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

    const upi = await Upi.findOne({ _id: id, userId: req.user._id });
    if (!upi) return res.status(404).json({ message: "UPI not found" });

    if (upiName) upi.upiName = upiName;
    if (upiId) upi.upiId = upiId;
    if (status) upi.status = status;

    await upi.save();
    res.json({ message: "UPI updated", upi });
  } catch (error) {
    res.status(500).json({ message: "Failed to update UPI", error });
  }
};


// Delete UPI
const deleteUpi = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Upi.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!deleted) return res.status(404).json({ message: "UPI not found or not authorized" });

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
