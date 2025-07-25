const Upi = require("../models/AdminUpi");

const createUpi = async (req, res) => {
  try {
    const { upiName, upiId } = req.body;

    if (!upiName || !upiId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Make all previous admin UPIs inactive
    await Upi.updateMany(
      { userId: req.user._id },
      { $set: { status: "inactive" } }
    );

    const qrImage = req.file ? `/uploads/upi_qr/${req.file.filename}` : null;

    const newUpi = await Upi.create({
      userId: req.user._id,
      upiName,
      upiId,
      qrImage,
      status: "active",
    });

    res.status(201).json({ message: "UPI added successfully", upi: newUpi });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// List all UPIs
const listUpis = async (req, res) => {
  try {
    const upis = await Upi.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ upis });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch UPIs", error });
  }
};

const updateUpi = async (req, res) => {
  try {
    const { id } = req.params;
    const { upiName, upiId, status } = req.body;

    const upi = await Upi.findOne({ _id: id, userId: req.user._id });
    if (!upi) return res.status(404).json({ message: "UPI not found" });

    if (upiName) upi.upiName = upiName;
    if (upiId) upi.upiId = upiId;
    if (status) upi.status = status;

    // ✅ Handle optional new image upload
    if (req.file) {
      upi.qrImage = `/uploads/upi_qr/${req.file.filename}`;
    }

    await upi.save();
    res.json({ message: "UPI updated", upi });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update UPI", error: error.message });
  }
};

// Delete UPI
const deleteUpi = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Upi.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "UPI not found or not authorized" });

    res.json({ message: "UPI deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete UPI", error });
  }
};

const setActiveUpi = async (req, res) => {
  try {
    const { upiId } = req.params;

    // Deactivate all UPIs for this user
    await Upi.updateMany({ userId: req.user._id }, { status: "inactive" });

    // Activate the selected UPI
    const updated = await Upi.findOneAndUpdate(
      { _id: upiId, userId: req.user._id },
      { status: "active" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "UPI not found" });
    }

    res.json({ message: "UPI set to active", upi: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update UPI", error });
  }
};

getActiveUpiForUser = async (req, res) => {
  try {
    const upi = await Upi.findOne({ status: "active" }); // Admin UPI
    if (!upi) return res.status(404).json({ message: "No active UPI found" });
    res.json({ upi });
  } catch (error) {
    console.error("Get Active UPI Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUpi,
  listUpis,
  updateUpi,
  deleteUpi,
  setActiveUpi,
  getActiveUpiForUser,
};
