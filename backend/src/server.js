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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, "");
    const allowedClientUrl = ENV.CLIENT_URL ? ENV.CLIENT_URL.replace(/\/+$/, "") : "";
    if (cleanOrigin === allowedClientUrl || cleanOrigin.endsWith(".vercel.app") || cleanOrigin.includes("localhost")) {
      return callback(null, true);
    }
    return callback(null, true);
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
