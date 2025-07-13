const express = require("express");
const router = express.Router();
const { createDeposit } = require("../controllers/depositController");
const upload = require("../config/multerConfig"); // ✅ This is a function now
const { protect } = require("../middlewares/auth");

router.post(
  "/",
  protect,
  upload("deposits").single("screenshot"), // ✅ call function first, then `.single()`
  createDeposit
);

module.exports = router;
