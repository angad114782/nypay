const express = require("express");
const router = express.Router();
const withdrawController = require("../controllers/withdrawController");
const { protect, roleCheck } = require("../middlewares/auth"); // updated import

/* ---------------------------- User Route ---------------------------- */

// 🟢 Request Withdrawal (User)
router.post("/request", protect, withdrawController.requestWithdraw);

/* ---------------------------- Admin / Manager / Auditor / Withdraw Team ---------------------------- */

// 🔵 Get All Withdraws
router.get(
  "/admin/withdraws",
  protect,
  roleCheck("admin", "manager", "auditor", "withdrawal"),
  withdrawController.getAllWithdraws
);

// 🔄 Update Withdraw Status
router.patch(
  "/admin/status/:id",
  protect,
  roleCheck("admin", "manager", "auditor", "withdrawal"),
  withdrawController.updateWithdrawStatus
);

// 📝 Update Withdraw Remark (Optional future route)
// router.put(
//   "/admin/remark/:id",
//   protect,
//   roleCheck("admin", "manager", "auditor", "withdraw"),
//   withdrawController.updateWithdrawRemark
// );

module.exports = router;
