const mongoose = require("mongoose");

const PanelDepositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Panel",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    default: "",
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

module.exports = mongoose.model("PanelDeposit", PanelDepositSchema);
