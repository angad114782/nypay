const mongoose = require("mongoose");

const panelSchema = new mongoose.Schema(
  {
    profileName: { type: String, required: true },
    userId: { type: String, required: true }, 
    logo: { type: String },
    roles: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Panel", panelSchema);
