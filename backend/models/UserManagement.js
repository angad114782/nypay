const mongoose = require("mongoose");

const userManagementSchema = new mongoose.Schema(
  {
    profileName: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    roles: {
      type: [String],
      enum: [
        "Admin",
        "Deposit",
        "Manager",
        "Withdrawal",
        "Auditor",
        "CreateID",
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserManagement", userManagementSchema);
