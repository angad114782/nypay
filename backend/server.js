const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:5000",
    "http://localhost:5173",
    "https://qs3rfs46-5000.inc1.devtunnels.ms",
    "https://qs3rfs46-5173.inc1.devtunnels.ms",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if using cookies or HTTP auth
};

app.use(cors(corsOptions));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("✅ nypay API is up and running");
});
// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);

const depositRoutes = require("./routes/depositRoutes");
app.use("/api/deposit", depositRoutes);

const bankRoutes = require("./routes/bankRoutes");
app.use("/api/bank", bankRoutes);

const upiRoutes = require("./routes/upiRoutes");
app.use("/api/upi", upiRoutes);

const adminBankRoutes = require("./routes/adminBankRoutes");
app.use("/api/admin/bank", adminBankRoutes);

const adminUpiRoutes = require("./routes/adminUpiRoutes");
app.use("/api/admin/upi", adminUpiRoutes);

const withdrawRoutes = require("./routes/withdrawRoutes");
app.use("/api/withdraw", withdrawRoutes);

const panelRoutes = require("./routes/panelRoutes");
app.use("/api/panels", panelRoutes);

const sliderRoutes = require("./routes/sliderRoutes");
app.use("/api/slider", sliderRoutes);

const userGameIdRoutes = require("./routes/userGameIdRoutes");
app.use("/api/game", userGameIdRoutes);

const allUserRoutes = require("./routes/allUserRoutes");
app.use("/api/users", allUserRoutes);

const passbookRoutes = require("./routes/passbookRoutes");
app.use("/api/passbook", passbookRoutes);

const panelWithdrawRoutes = require("./routes/panelWithdrawRoute");
app.use("/api/panel-withdraw", panelWithdrawRoutes);

const panelDepositRoute = require("./routes/panelDepositRoute");
app.use("/api/panel-deposit", panelDepositRoute);

const userManagementRoute = require("./routes/userManagementRoutes");
app.use("/api/user-management", userManagementRoute);


const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
