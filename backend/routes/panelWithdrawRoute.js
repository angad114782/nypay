const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth");
const { createPanelWithdraw ,getAllPanelWithdraws, 
updatePanelWithdrawStatus } = require("../controllers/panelWithdrawController");

// POST /api/panel/withdraw
router.post("/withdraw", protect, createPanelWithdraw);

router.get("/all", protect, getAllPanelWithdraws);

// PATCH - update withdraw status
router.patch("/:id/status", protect, adminOnly, updatePanelWithdrawStatus);

module.exports = router;
