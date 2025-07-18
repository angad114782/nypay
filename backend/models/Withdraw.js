const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  withdrawMethod: { type: String, enum: ["upi", "bank"], required: true },
  selectedAccount: { type: Object, required: true },
status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  remark: { type: String, default: "" }, // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
