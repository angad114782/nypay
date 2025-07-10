const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: String,
  otp: String,
  type: { type: String, enum: ["register", "login", "forgot-password"] },
  expiresAt: Date,
  data: {
    name: String,
    email: String,
    password: String,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
