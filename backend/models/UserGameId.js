// models/UserGameId.js
const mongoose = require("mongoose");

const userGameIdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserGameId", userGameIdSchema);
