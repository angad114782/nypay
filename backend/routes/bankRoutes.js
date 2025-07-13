const express = require("express");
const router = express.Router();
const { addBank , getBanks, updateBank, deleteBank  } = require("../controllers/bankController");
const { protect } = require("../middlewares/auth");

router.post("/add", protect, addBank);
router.get("/list", protect, getBanks);
router.put("/update/:id", protect, updateBank);    // ✅ Edit
router.delete("/delete/:id", protect, deleteBank); // ✅ Delete


module.exports = router;
