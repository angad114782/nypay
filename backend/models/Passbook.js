// models/Passbook.js
const mongoose = require("mongoose");

const passbookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., "withdraw", "deposit", "panel-deposit", "panel-withdraw"
  direction: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, },
  balance: { type: Number,}, // wallet after transaction
  description: { type: String },
  panelId: { type: mongoose.Schema.Types.ObjectId, ref: "Panel", default: null }, // ✅ Add this
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // ✅ Optional if used
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Passbook", passbookSchema);
