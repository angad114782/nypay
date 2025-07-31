const mongoose = require("mongoose");

const passbookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., "deposit", "withdraw", etc.
  direction: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number },
  balance: { type: Number },
  description: { type: String },
  panelId: { type: mongoose.Schema.Types.ObjectId, ref: "Panel", default: null },

  // ✅ ADD THIS FIELD
  linkedId: { type: mongoose.Schema.Types.ObjectId, default: null },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Passbook", passbookSchema);
