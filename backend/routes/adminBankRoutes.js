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

const { protect, roleCheck } = require("../middlewares/auth");

// 🟢 Only Admins can add a bank
router.post("/add", protect, roleCheck("admin", "manager"), addBank);

// 🟢 Only Admins can get the list of banks
router.get("/list", protect, getBanks);
router.get("/active-bank", protect, getActiveBankForUser);

// 🟢 Only Admins can update a bank
router.patch("/update/:id", protect, roleCheck("admin", "manager"), updateBank);

// 🟢 Only Admins can delete a bank
router.delete(
  "/delete/:id",
  protect,
  roleCheck("admin", "manager"),
  deleteBank
);

router.patch(
  "/set-active/:bankId",
  protect,
  roleCheck("admin", "manager"),
  setActiveBank
);

module.exports = router;
