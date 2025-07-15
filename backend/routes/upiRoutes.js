const express = require("express");
const router = express.Router();
const {
  createUpi,
  listUpis,
  updateUpi,
  deleteUpi,
} = require("../controllers/upiController");
const { protect } = require("../middlewares/auth");
const upload = require("../config/multerConfig"); // your multer setup

// 🟢 Updated route to handle image upload
router.post("/add", protect, upload("upi_qr").single("qrImage"), createUpi);

router.get("/list", protect, listUpis);
router.put("/update/:id", protect, upload("upi_qr").single("qrImage"), updateUpi);

router.delete("/delete/:id", protect, deleteUpi);

module.exports = router;
