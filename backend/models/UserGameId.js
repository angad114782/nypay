const mongoose = require("mongoose");

const userGameIdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    panelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panel", // ✅ Link to the Panel model
      required: true,
    },

    username: { type: String, required: true },
    password: { type: String, required: true },

    type: [{ type: String }], // e.g., "Teen Patti", "Poker"

    status: { type: String, default: "Pending" },
    isBlocked: { type: Boolean, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserGameId", userGameIdSchema);
