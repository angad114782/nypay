const express = require("express");
const router = express.Router();
const withdrawController = require("../controllers/withdrawController");
const { protect } = require("../middlewares/auth");

router.post("/request", protect, withdrawController.requestWithdraw);
router.get("/all", protect, withdrawController.getAllWithdraws); // optionally use adminOnly middleware
router.put("/status/:id", protect, withdrawController.updateWithdrawStatus); // optionally adminOnly

module.exports = router;
