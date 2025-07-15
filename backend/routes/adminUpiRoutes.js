const express = require("express");
const router = express.Router();
const {
  createUpi,
  listUpis,
  updateUpi,
  deleteUpi,
  setActiveUpi,
  getActiveUpiForUser,
} = require("../controllers/adminUpiController");
const { protect, adminOnly } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

// 🟢 Only Admins can create UPI
router.post("/add", protect, adminOnly, upload("upi_qr").single("qrImage"), createUpi);

router.get("/list", protect, listUpis);
router.get("/active-upi", getActiveUpiForUser);

// 🟢 Only Admins can update UPI
router.put("/update/:id", protect, adminOnly, upload("upi_qr").single("qrImage"), updateUpi);

// 🟢 Only Admins can delete UPI
router.delete("/delete/:id", protect, adminOnly, deleteUpi);
router.patch("/set-active/:upiId", protect, adminOnly, setActiveUpi);

module.exports = router;
