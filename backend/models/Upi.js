const mongoose = require("mongoose");

const upiSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    upiName: { type: String, required: true },
    upiId: { type: String, required: true },
    qrImage: { type: String }, // 🆕 new field
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upi", upiSchema);
