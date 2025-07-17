const Panel = require("../models/Panel");
const path = require("path");

// CREATE
const createPanel = async (req, res) => {
  try {
    const { profileName, userId, password, roles } = req.body;
    const logo = req.file ? req.file.filename : null;

    const newPanel = new Panel({
      profileName,
      userId,
      logo,
      roles: roles ? JSON.parse(roles) : [],
    });

    await newPanel.save();
    res.status(201).json({ message: "Panel created successfully", panel: newPanel });
  } catch (err) {
    console.error("Create Panel Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET ALL
const getAllPanels = async (req, res) => {
  try {
    const panels = await Panel.find().sort({ createdAt: -1 });

    const fullPanels = panels.map(panel => ({
      ...panel._doc,
      logoUrl: panel.logo ? `${req.protocol}://${req.get("host")}/uploads/panels/${panel.logo}` : null
    }));

    res.json({ success: true, panels: fullPanels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE
const updatePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.logo = req.file.filename;
    }

    const panel = await Panel.findByIdAndUpdate(id, updates, { new: true });

    const updatedPanel = {
      ...panel._doc,
      logoUrl: panel.logo ? `${req.protocol}://${req.get("host")}/uploads/panels/${panel.logo}` : null,
    };

    res.json({ success: true, panel: updatedPanel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE
const deletePanel = async (req, res) => {
  try {
    const { id } = req.params;
    const panel = await Panel.findByIdAndDelete(id);
    res.json({ success: true, message: "Panel deleted", panel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// TOGGLE STATUS
const togglePanelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const panel = await Panel.findById(id);
    panel.isActive = !panel.isActive;
    await panel.save();
    res.json({ success: true, status: panel.isActive });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createPanel,
  getAllPanels,
  updatePanel,
  deletePanel,
  togglePanelStatus,
};
