const express = require("express");
const router = express.Router();
const {
  addBank,
  getBanks,
  updateBank,
  deleteBank,
} = require("../controllers/bankController");

const { protect, adminOnly } = require("../middlewares/auth");

// 🟢 Only Admins can add a bank
router.post("/add", protect, adminOnly, addBank);

// 🟢 Only Admins can get the list of banks
router.get("/list", protect, getBanks);

// 🟢 Only Admins can update a bank
router.put("/update/:id", protect, adminOnly, updateBank);

// 🟢 Only Admins can delete a bank
router.delete("/delete/:id", protect, adminOnly, deleteBank);

module.exports = router;
