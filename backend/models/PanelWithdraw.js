const mongoose = require("mongoose");

const PanelWithdrawSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Panel", // or String if no Panel model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: Date,
});

module.exports = mongoose.model("PanelWithdraw", PanelWithdrawSchema);
