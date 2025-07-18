const mongoose = require("mongoose");

const userGameIdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    password: { type: String, required: true },

    // ✅ Add these fields
    type: { type: String }, // e.g., "Teen Patti", "Poker", etc.
    gameName: { type: String },
    gameLogo: { type: String }, // URL to logo image
    gameUrl: { type: String },

    status: { type: String, default: "Pending" },
    isBlocked: { type: Boolean, default: false },
    remark: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserGameId", userGameIdSchema);
