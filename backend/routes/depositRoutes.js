const express = require("express");
const router = express.Router();

const {
  createDeposit,
  getAllDeposits,
  updateDepositStatus,
  // updateDepositRemark,
  getMyWalletBalance,
} = require("../controllers/depositController");

const upload = require("../config/multerConfig");
const { protect, roleCheck } = require("../middlewares/auth"); // updated import

/* ---------------------------- User Routes ---------------------------- */

// 🟢 Create Deposit (User uploads screenshot)
router.post(
  "/",
  protect,
  upload("deposits").single("screenshot"),
  createDeposit
);

// 🔵 Get Wallet Balance (for both user & admin)
router.get("/wallet/balance", protect, getMyWalletBalance);

/* ---------------------------- Admin / Manager / Auditor / Deposit Team ---------------------------- */

// 🔵 Get All Deposits
router.get(
  "/admin/deposits",
  protect,
  roleCheck("admin", "manager", "auditor", "deposit"),
  getAllDeposits
);

// 🔄 Update Deposit Status (approve/reject)
router.patch(
  "/admin/status/:id",
  protect,
  roleCheck("admin", "manager", "auditor", "deposit"),
  updateDepositStatus
);

// 📝 Update Deposit Remark (optional feature for future)
// router.put(
//   "/admin/remark/:id",
//   protect,
//   roleCheck("admin", "manager", "auditor", "deposit"),
//   updateDepositRemark
// );

module.exports = router;
