const express = require("express");
const router = express.Router();

const {
  createPanelWithdraw,
  getAllPanelWithdraws,
  updatePanelWithdrawStatus,
} = require("../controllers/panelWithdrawController");

const { protect, roleCheck } = require("../middlewares/auth"); // ✅ updated import

/* ---------------------------- Panel Withdraw Routes ---------------------------- */

// 🟢 Panel user creates withdraw request
router.post("/withdraw", protect, createPanelWithdraw);

// 🔵 Get all panel withdraws (admin/manager/auditor/etc.)
router.get("/all", protect, getAllPanelWithdraws);

// 🔄 Update status (approve/reject) — multiple roles allowed
router.patch(
  "/:id/status",
  protect,
  roleCheck("admin", "manager", "auditor", "withdrawal"),
  updatePanelWithdrawStatus
);

module.exports = router;
