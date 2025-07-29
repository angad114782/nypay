
const { default: mongoose } = require("mongoose");

const UserManagement = new mongoose.Schema({
  profileName: { type: String, required: true },
  userId: { type: String, unique: true, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: [{ type: String}],
  permissions: [{ type: String }], // e.g., ["admin", "deposit"]
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("UserManagement", UserManagement);