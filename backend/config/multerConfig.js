const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Generates a multer upload middleware for the given folder
 * Example: upload("deposits"), upload("profile_pic")
 */
const upload = (folderName = "uploads") => {
  const uploadPath = path.join(__dirname, "..", "uploads", folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = folderName.replace(/[^a-zA-Z0-9]/g, "_");
      cb(null, `${base}_${Date.now()}${ext}`);
    },
  });

  return multer({ storage });
};

module.exports = upload; // ✅ Now this is a function
