import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import healthRoutes from './routes/health.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from "./lib/env.js";
import { app } from './lib/socket.js';
import { server } from './lib/socket.js';

const PORT = ENV.PORT || process.env.PORT || 5000;

// Enable trust proxy for secure cookies behind reverse proxy / cloud load balancers
app.set("trust proxy", 1);

app.use(express.json({ limit: '5mb' }));

// ── CORS ──────────────────────────────────────────────────────────────────────
// Build allowedOrigins from CLIENT_URL env var.
// In production CLIENT_URL should be "https://germa-blue.vercel.app"
const allowedOrigins = new Set();
if (ENV.CLIENT_URL) {
  allowedOrigins.add(ENV.CLIENT_URL.replace(/\/+$/, ""));
}
// Always allow localhost for development
allowedOrigins.add("http://localhost:5173");
allowedOrigins.add("http://localhost:3000");

// Log on startup so we can verify the exact value on Render logs
console.log("[CORS] CLIENT_URL env =", JSON.stringify(ENV.CLIENT_URL));
console.log("[CORS] Allowed origins =", [...allowedOrigins]);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, health checks)
    if (!origin) return callback(null, true);

    const clean = origin.replace(/\/+$/, "");
    if (allowedOrigins.has(clean)) {
      return callback(null, clean); // Reflect the exact origin
    }

    // Log unexpected origins so we can diagnose in Render logs
    console.warn("[CORS] Blocked origin:", origin);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_, res) => {
  res.json({ status: "API is running" });
});

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;
