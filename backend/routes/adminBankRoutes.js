const express = require("express");
const router = express.Router();
const {
  addBank,
  getBanks,
  updateBank,
  deleteBank,
  setActiveBank,
  getActiveBankForUser,
} = require("../controllers/adminBankController");

const { protect, adminOnly } = require("../middlewares/auth");

// 🟢 Only Admins can add a bank
router.post("/add", protect, adminOnly, addBank);

// 🟢 Only Admins can get the list of banks
router.get("/list", protect, getBanks);
router.get("/active-bank", getActiveBankForUser);

// 🟢 Only Admins can update a bank
router.put("/update/:id", protect, adminOnly, updateBank);

// 🟢 Only Admins can delete a bank
router.delete("/delete/:id", protect, adminOnly, deleteBank);


router.patch("/set-active/:bankId", protect, setActiveBank);

module.exports = router;
