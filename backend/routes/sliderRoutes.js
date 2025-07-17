const express = require("express");
const router = express.Router();
// const upload = require("../config/multerConfig")("slider"); // 👈 pass folder name

const sliderController = require("../controllers/sliderController");
const multer = require("multer");
const path = require("path");
// 1. Tell Multer where to store and how to name files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/slider"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, `slider_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// 2. Create the upload middleware
const upload = multer({ storage });

router.post(
  "/upload",
  upload.array("images", 10),
  sliderController.uploadSliderImages
);
router.get("/", sliderController.getAllSliders);
router.delete("/:id", sliderController.deleteSliderImage);
router.delete("/", sliderController.deleteAllSliderImages);

module.exports = router;
