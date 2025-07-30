const express = require("express");
const router = express.Router();

const {
  createPanelDeposit,
  getAllPanelDeposits,
  updatePanelDepositStatus,
} = require("../controllers/panelDepositController");

const { protect, roleCheck } = require("../middlewares/auth"); // updated import

/* ---------------------------- Panel Deposit Routes ---------------------------- */

// 🟢 Panel user creates deposit request
router.post("/deposit", protect, createPanelDeposit);

// 🔵 Get all panel deposits (for admin dashboard or filtered view)
router.get("/all", protect, getAllPanelDeposits);

// 🔄 Update status (approve/reject) by admin or assigned roles
router.patch(
  "/:id/status",
  protect,
  roleCheck("admin", "manager", "auditor", "deposit"),
  updatePanelDepositStatus
);

module.exports = router;
