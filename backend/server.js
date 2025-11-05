const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const path = require("path");
const http = require("http"); // ✅ Required for socket.io
const { Server } = require("socket.io"); // ✅

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ Replace app.listen
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5000",
      "http://localhost:5173",
      "https://qs3rfs46-5000.inc1.devtunnels.ms",
      "https://qs3rfs46-5173.inc1.devtunnels.ms",
       "http://192.168.1.14:5001",
  "http://192.168.1.14:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// ✅ Make socket.io accessible in req.app
app.set("io", io);

// ✅ Optional: Debug connection logs
io.on("connection", (socket) => {
  // console.log("🟢 New socket connected");
  socket.on("disconnect", () => {
    // console.log("🔴 Socket disconnected");
  });
});

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5000",
    "http://localhost:5173",
    "https://qs3rfs46-5000.inc1.devtunnels.ms",
    "https://qs3rfs46-5173.inc1.devtunnels.ms",
       "http://192.168.1.14:5001",
  "http://192.168.1.14:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ nypay API is up and running");
});

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deposit", require("./routes/depositRoutes"));
app.use("/api/bank", require("./routes/bankRoutes"));
app.use("/api/upi", require("./routes/upiRoutes"));
app.use("/api/admin/bank", require("./routes/adminBankRoutes"));
app.use("/api/admin/upi", require("./routes/adminUpiRoutes"));
app.use("/api/withdraw", require("./routes/withdrawRoutes"));
app.use("/api/panels", require("./routes/panelRoutes"));
app.use("/api/slider", require("./routes/sliderRoutes"));
app.use("/api/game", require("./routes/userGameIdRoutes"));
app.use("/api/users", require("./routes/allUserRoutes"));
app.use("/api/passbook", require("./routes/passbookRoutes"));
app.use("/api/panel-withdraw", require("./routes/panelWithdrawRoute"));
app.use("/api/panel-deposit", require("./routes/panelDepositRoute"));
app.use("/api/user-management", require("./routes/userManagementRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ✅ Start with socket.io
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
