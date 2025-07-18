const express = require("express");
const router = express.Router();
const withdrawController = require("../controllers/withdrawController");
const { protect, adminOnly } = require("../middlewares/auth");

router.post("/request", protect, withdrawController.requestWithdraw);
router.get("/admin/withdraws", protect, adminOnly, withdrawController.getAllWithdraws);

router.patch("/admin/status/:withdrawalId", protect, adminOnly, withdrawController.updateWithdrawalStatus); // update status
router.patch("/admin/remark/:withdrawalId", protect, adminOnly, withdrawController.updateWithdrawalRemark); // update remark

module.exports = router;
