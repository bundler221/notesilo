require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("./passport");
const connectDB = require("./db");


const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const graphRoutes = require("./routes/graphRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

app.listen(5000, '0.0.0.0', () => console.log("Server running on 0.0.0.0:5000"));

