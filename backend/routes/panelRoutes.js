const express = require("express");
const {
  createPanel,
  getAllPanels,
  updatePanel,
  deletePanel,
  getAllPanelsAdmin,
  togglePanelStatus,
} = require("../controllers/panelController");

const { protect, roleCheck } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

const router = express.Router();


// 👤 Normal user (protected)
router.get("/panel", protect, getAllPanels);

// 🛡 Admin only
router.get("/admin", protect,
  roleCheck("admin", "manager"), getAllPanelsAdmin);
router.post("/panel", protect,
  roleCheck("admin", "manager"), upload("panels").single("logo"), createPanel);
router.put("/panel/:id", protect,
  roleCheck("admin", "manager"), upload("panels").single("logo"), updatePanel);
router.delete("/panel/:id", protect,
  roleCheck("admin", "manager"), deletePanel);
router.patch("/panel/toggle/:id", protect,
  roleCheck("admin", "manager"), togglePanelStatus);

module.exports = router;
