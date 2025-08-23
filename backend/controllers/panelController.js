const Panel = require("../models/Panel");
const path = require("path");

// CREATE
const createPanel = async (req, res) => {
  try {
    const { profileName, userId, password } = req.body;
    const logo = req.file ? req.file.filename : null;

    // Parse type safely
    let type = [];
    if (req.body.type) {
      try {
        type = JSON.parse(req.body.type); // Expecting array from frontend
      } catch (err) {
        return res.status(400).json({ message: "Invalid type format" });
      }
    }

    const newPanel = new Panel({
      profileName,
      userId,
      password,
      logo,
      type, // Array of strings
    });

    await newPanel.save();

    // ✅ Emit socket event after creation
    const io = req.app.get("io");
    if (io) {
      io.emit("panel-created", {
        action: "create",
        panelId: newPanel._id,
        profileName: newPanel.profileName,
        userId: newPanel.userId,
        type: newPanel.type,
        logo: newPanel.logo,
      });
    }
    res
      .status(201)
      .json({ message: "Panel created successfully", panel: newPanel });
  } catch (err) {
    console.error("Create Panel Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET ALL
const getAllPanels = async (req, res) => {
  try {
    const panels = await Panel.find({ isActive: true }).sort({ createdAt: -1 });

    const fullPanels = panels.map((panel) => ({
      ...panel._doc,
      logoUrl: panel.logo ? `/uploads/panels/${panel.logo}` : null,
    }));

    res.json({ success: true, panels: fullPanels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// GET ALL
const getAllPanelsAdmin = async (req, res) => {
  try {
    const panels = await Panel.find().sort({ createdAt: -1 });

    const fullPanels = panels.map((panel) => ({
      ...panel._doc,
      logoUrl: panel.logo ? `/uploads/panels/${panel.logo}` : null,
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
    const { profileName, userId, password, type } = req.body;
    const updates = {};

    if (profileName) updates.profileName = profileName;
    if (userId) updates.userId = userId;
    if (password) updates.password = password;
    if (type) updates.type = type;
    if (req.file) updates.logo = req.file.filename;

    const panel = await Panel.findByIdAndUpdate(id, updates, { new: true });
    // ✅ Emit socket event after creation
    const io = req.app.get("io");
    if (io) {
      io.emit("panel-updated", {
        action: "update",
        panelId: panel._id,
        profileName: panel.profileName,
        userId: panel.userId,
        type: panel.type,
        logo: panel.logo,
      });
    }
    const updatedPanel = {
      ...panel._doc,
      logoUrl: panel.logo ? `/uploads/panels/${panel.logo}` : null,
    };

    res.json({ success: true, panel: updatedPanel });
  } catch (err) {
    console.error("Update Panel Error:", err);
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

    if (!panel) {
      return res.status(404).json({
        success: false,
        message: "Panel not found",
      });
    }

    panel.isActive = !panel.isActive;
    await panel.save();

    // ✅ Emit socket event after status toggle
    const io = req.app.get("io");
    if (io) {
      io.emit("panel-status-updated", {
        action: "status-toggle",
        panelId: panel._id,
        isActive: panel.isActive,
      });
    }

    res.json({ success: true, status: panel.isActive });
  } catch (err) {
    console.error("❌ togglePanelStatus error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createPanel,
  getAllPanels,
  updatePanel,
  deletePanel,
  togglePanelStatus,
  getAllPanelsAdmin,
};
