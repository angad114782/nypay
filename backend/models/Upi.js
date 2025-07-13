const mongoose = require("mongoose");

const upiSchema = new mongoose.Schema(
  {
    upiName: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upi", upiSchema);
