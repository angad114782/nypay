const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middlewares/auth");


router.get("/stats",  protect, adminOnly, getDashboardStats);

module.exports = router;
