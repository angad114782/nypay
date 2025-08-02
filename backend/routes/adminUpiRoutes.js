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
const { protect, roleCheck } = require("../middlewares/auth");
const upload = require("../config/multerConfig");

// 🟢 Only Admins can create UPI
router.post("/add", protect,
  roleCheck("admin", "manager"), upload("upi_qr").single("qrImage"), createUpi);

router.get("/list", protect, listUpis);
router.get("/active-upi", getActiveUpiForUser);

// 🟢 Only Admins can update UPI
router.put("/update/:id", protect,
  roleCheck("admin", "manager"), upload("upi_qr").single("qrImage"), updateUpi);

// 🟢 Only Admins can delete UPI
router.delete("/delete/:id", protect,
  roleCheck("admin", "manager"), deleteUpi);
router.patch("/set-active/:upiId", protect,
  roleCheck("admin", "manager"), setActiveUpi);

module.exports = router;
