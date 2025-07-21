const express = require("express");
const {
  createPanel,
  getAllPanels,
  updatePanel,
  deletePanel,
  getAllPanelsAdmin,
  togglePanelStatus,
} = require("../controllers/panelController");

const { protect, adminOnly } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

const router = express.Router();


// 👤 Normal user (protected)
router.get("/panel", protect, getAllPanels);

// 🛡 Admin only
router.get("/admin", protect, getAllPanelsAdmin);
router.post("/panel", protect, adminOnly, upload("panels").single("logo"), createPanel);
router.put("/panel/:id", protect, adminOnly, upload("panels").single("logo"), updatePanel);
router.delete("/panel/:id", protect, adminOnly, deletePanel);
router.patch("/panel/toggle/:id", protect, adminOnly, togglePanelStatus);

module.exports = router;
