const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig")("slider"); // 👈 pass folder name

const sliderController = require("../controllers/sliderController");

router.post("/upload", upload.array("images", 10), sliderController.uploadSliderImages);
router.get("/", sliderController.getAllSliders);
router.delete("/:id", sliderController.deleteSliderImage);
router.delete("/delete-all", sliderController.deleteAllSliderImages);

module.exports = router;
