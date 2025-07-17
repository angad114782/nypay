// routes/depositRoutes.js
const express = require("express");
const router = express.Router();
const {
  createDeposit,
  getAllDeposits,
  updateDepositStatus,
  updateDepositRemark
} = require("../controllers/depositController");
const upload = require("../config/multerConfig");
const { protect, adminOnly } = require("../middlewares/auth");

// Create Deposit
router.post(
  "/",
  protect,
  upload("deposits").single("screenshot"),
  createDeposit
);

// Get All Deposits (Admin)
router.get("/admin/deposits", protect, adminOnly, getAllDeposits);

// ✅ Update Status
router.patch("/admin/status/:depositId", protect, adminOnly, updateDepositStatus);

// ✅ Update Remark
router.patch("/admin/remark/:depositId", protect, adminOnly, updateDepositRemark);

module.exports = router;
