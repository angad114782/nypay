const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  wallet: {
    type: Number,
    default: 0,
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "user" },
  lastLoginIp: { type: String },
  city: { type: String },
  region: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  profilePic: { type: String },

});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
