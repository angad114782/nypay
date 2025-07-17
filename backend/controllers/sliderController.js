const Slider = require("../models/Slider");
const fs = require("fs");
const path = require("path");

// controllers/slider.js
exports.uploadSliderImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded." });
    }

    // only keep one entry per filename
    const uniqueFiles = Array.from(new Set(files.map((f) => f.filename))).map(
      (fn) => files.find((f) => f.filename === fn)
    );

    const sliderImages = await Promise.all(
      uniqueFiles.map((file) => {
        return new Slider({
          imageUrl: `/uploads/slider/${file.filename}`,
        }).save();
      })
    );

    res
      .status(201)
      .json({ message: "Images uploaded successfully", data: sliderImages });
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

    // remove leading slash:
    const relativePath = slider.imageUrl.replace(/^\/+/, "");
    const filePath = path.join(__dirname, "..", relativePath);

    // use the promise API so you can catch errors if you want
    await fs.promises.unlink(filePath).catch((err) => {
      console.warn(`Couldn’t delete file ${filePath}:`, err);
    });

    await slider.deleteOne();
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("deleteSliderImage error:", err);
    return res.status(500).json({ message: "Failed to delete image" });
  }
};

exports.deleteAllSliderImages = async (req, res) => {
  try {
    const sliders = await Slider.find();

    await Promise.all(
      sliders.map(async (slider) => {
        // Extract just the filename (e.g., "slider_123456789.jpg")
        const filename = path.basename(slider.imageUrl);

        // Correct path construction for your structure
        const filePath = path.join(
          __dirname,
          "..", // Go up from controllers/ to backend/
          "uploads",
          "slider",
          filename
        );

        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.warn(`Failed to delete ${filePath}:`, err.message);
        }
      })
    );

    await Slider.deleteMany();

    res.status(200).json({
      success: true,
      message: "All slider images deleted successfully",
      deletedCount: sliders.length,
    });
  } catch (err) {
    console.error("deleteAllSliderImages error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete all images",
      error: err.message,
    });
  }
};
