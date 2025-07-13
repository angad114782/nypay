const mongoose = require("mongoose");

const upiAccountSchema = new mongoose.Schema({
  name: String,
  id: String, // UPI ID
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UPIAccount", upiAccountSchema);
