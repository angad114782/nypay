const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth");
const { createPanelDeposit, getAllPanelDeposits,
    updatePanelDepositStatus } = require("../controllers/panelDepositController");

// POST /api/panel/deposit
router.post("/deposit", protect, createPanelDeposit);
router.get("/all", protect, getAllPanelDeposits);

// Update deposit status
router.patch("/:id/status", protect, adminOnly, updatePanelDepositStatus);

module.exports = router;
