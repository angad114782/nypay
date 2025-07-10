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
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if using cookies or HTTP auth
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
