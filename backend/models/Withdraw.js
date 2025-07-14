const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  withdrawMethod: { type: String, enum: ["upi", "bank"], required: true },
  selectedAccount: { type: Object, required: true }, // stores selected UPI or Bank details
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
