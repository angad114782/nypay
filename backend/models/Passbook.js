// models/Passbook.js
const mongoose = require("mongoose");

const passbookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., "withdraw", "deposit"
  direction: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true }, // wallet after transaction
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Passbook", passbookSchema);
