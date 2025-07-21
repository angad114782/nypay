const express = require("express");
const router = express.Router();
const { getMyPassbook } = require("../controllers/passbookController");
const { protect } = require("../middlewares/auth");

router.get("/my", protect, getMyPassbook);

module.exports = router;
