// models/Upi.js
const mongoose = require("mongoose");

const upiSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    upiName: { type: String, required: true },
    upiId: { type: String, required: true },
    status: { type: String, default: "active" }, // Optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upi", upiSchema);
