const mongoose = require("mongoose");

const panelSchema = new mongoose.Schema(
  {
    profileName: { type: String, required: true },
    userId: { type: String, required: true }, // Panel Link
    password: { type: String }, // Optional
    type: [{ type: String }],// e.g., "Asia Type", "Diamond99 Type"
    logo: { type: String }, // filename
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Panel", panelSchema);
