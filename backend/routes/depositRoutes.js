const express = require("express");
const router = express.Router();
const {
  createDeposit,
  getAllDeposits,
  updateDepositStatus,
  // updateDepositRemark,
  getMyWalletBalance, // 🆕
} = require("../controllers/depositController");

const upload = require("../config/multerConfig");
const { protect, adminOnly } = require("../middlewares/auth");

// 🟢 Create Deposit
router.post(
  "/",
  protect,
  upload("deposits").single("screenshot"),
  createDeposit
);

// 🔵 Get Wallet Balance (user or admin)
router.get("/wallet/balance", protect, getMyWalletBalance); // 🆕

/* ---------------------------- Admin Routes ---------------------------- */

// 🔵 Get All Deposits
router.get("/admin/deposits", protect, adminOnly, getAllDeposits);

// 🔄 Update Deposit Status (approve/reject)
router.patch("/admin/status/:id", protect, adminOnly, updateDepositStatus);

// 📝 Update Deposit Remark
// router.put("/admin/remark/:id", protect, adminOnly, updateDepositRemark);

module.exports = router;
