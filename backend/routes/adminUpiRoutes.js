const express = require("express");
const router = express.Router();
const {
  createUpi,
  listUpis,
  updateUpi,
  deleteUpi,
} = require("../controllers/upiController");
const { protect, adminOnly } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

// 🟢 Only Admins can create UPI
router.post("/add", protect, adminOnly, upload("upi_qr").single("qrImage"), createUpi);

// 🟢 Only Admins can list UPIs
router.get("/list", protect, listUpis);

// 🟢 Only Admins can update UPI
router.put("/update/:id", protect, adminOnly, upload("upi_qr").single("qrImage"), updateUpi);

// 🟢 Only Admins can delete UPI
router.delete("/delete/:id", protect, adminOnly, deleteUpi);

module.exports = router;
