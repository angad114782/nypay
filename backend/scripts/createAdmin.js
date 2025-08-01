require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // const email = "admin@example.com";
    const email = "super-admin@example.com"; // Change to

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Admin already exists");
      return process.exit(0);
    }

    const admin = new User({
      name: "Super Admin1",
      phone: "9999999991",
      email,
      password: "admin12", // plain, will be hashed via pre-save hook
      isVerified: true,
      role: "super-admin",
    });
    // const admin = new User({
    //   name: "Admin1",
    //   phone: "9999999992",
    //   email,
    //   password: "admin123", // plain, will be hashed via pre-save hook
    //   isVerified: true,
    //   role: "admin",
    // });
    await admin.save();

    console.log("✅ Admin created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}
// export default createAdmin;

createAdmin();
