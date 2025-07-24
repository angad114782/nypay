const express = require("express");
const router = express.Router();
const withdrawController = require("../controllers/withdrawController");
const { protect, adminOnly } = require("../middlewares/auth");

router.post("/request", protect, withdrawController.requestWithdraw);
router.get(
  "/admin/withdraws",
  protect,
  adminOnly,
  withdrawController.getAllWithdraws
);

router.patch(
  "/admin/status/:id",
  protect,
  adminOnly,
  withdrawController.updateWithdrawStatus
); // update status
// router.put(
//   "/admin/remark/:id",
//   protect,
//   adminOnly,
//   withdrawController.updateWithdrawRemark
// ); // update remark

module.exports = router;
