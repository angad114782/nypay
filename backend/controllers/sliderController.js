const Slider = require("../models/Slider");
const fs = require("fs");
const path = require("path");

exports.uploadSliderImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded." });
    }

    const sliderImages = await Promise.all(
      files.map((file) => {
        const newSlider = new Slider({
          imageUrl: `/uploads/sliders/${file.filename}`
        });
        return newSlider.save();
      })
    );

    res.status(201).json({ message: "Images uploaded successfully", data: sliderImages });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload images" });
  }
};

exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ uploadedAt: -1 });
    res.status(200).json(sliders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sliders" });
  }
};

exports.deleteSliderImage = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: "Image not found" });

    const filePath = path.join(__dirname, "../", slider.imageUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.warn("File deletion failed:", err);
    });

    await slider.deleteOne();
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};

exports.deleteAllSliderImages = async (req, res) => {
  try {
    const sliders = await Slider.find();
    sliders.forEach((slider) => {
      const filePath = path.join(__dirname, "../", slider.imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Error deleting file:", err);
      });
    });

    await Slider.deleteMany();
    res.status(200).json({ message: "All images deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete all images" });
  }
};
