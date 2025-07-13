const express = require("express");

const router = express.Router();
const { createUpi , listUpis, updateUpi, deleteUpi  } = require("../controllers/upiController");
const { protect } = require("../middlewares/auth");


router.post("/add", protect, createUpi);
router.get("/list", protect, listUpis);
router.put("/update/:id", protect, updateUpi);
router.delete("/delete/:id", protect, deleteUpi);



module.exports = router;
