require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: false }));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3, maxlength: 24, unique: true, index: true },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false }
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", userSchema);

function authRequired(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    if (!token) throw new Error("Missing token");
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Please sign in again." });
  }
}

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
}));

app.post("/api/auth/register", async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: "Server authentication is not configured." });
    const username = String(req.body?.username || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!/^[a-zA-Z0-9_-]{3,24}$/.test(username)) {
      return res.status(400).json({ error: "Username must be 3–24 characters: letters, numbers, _ or -." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (password.length < 10 || password.length > 128) {
      return res.status(400).json({ error: "Password must be 10–128 characters." });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });
    const token = jwt.sign({ sub: String(user._id), username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({ token, user: { id: String(user._id), username: user.username, email: user.email } });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: "That username or email is already registered." });
    console.error("Registration failed:", err.message);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: "Server authentication is not configured." });
    const login = String(req.body?.login || "").trim();
    const password = String(req.body?.password || "");
    if (!login || !password) return res.status(400).json({ error: "Enter your username/email and password." });
    const user = await User.findOne({
      $or: [{ username: login }, { email: login.toLowerCase() }]
    }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Incorrect login or password." });
    }
    const token = jwt.sign({ sub: String(user._id), username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: String(user._id), username: user.username, email: user.email } });
  } catch (err) {
    console.error("Login failed:", err.message);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub).select("username email createdAt");
    if (!user) return res.status(404).json({ error: "Account not found." });
    res.json({ user: { id: String(user._id), username: user.username, email: user.email, createdAt: user.createdAt } });
  } catch {
    res.status(500).json({ error: "Could not load account." });
  }
});

app.get("/api/game/status", (_req, res) => res.json({
  name: "Paris Drive",
  city: "Paris, France",
  stage: "prototype",
  features: ["third-person driving", "touch controls", "keyboard controls", "Paris landmarks"]
}));

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      // Keep the service available so /api/health can report the disconnected state.
    }
  } else {
    console.warn("MONGODB_URI is not set; registration/login will not persist until configured.");
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Paris Drive listening on ${PORT}`));
}
start();
