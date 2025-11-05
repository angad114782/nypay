const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: String, // ✅ Add this line
  otp: String,
  type: {
    type: String,
    enum: ["register", "login", "forgot-password", "reset"], // added "reset" as well
  },
  expiresAt: Date,
  data: {
    name: String,
    password: String,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
