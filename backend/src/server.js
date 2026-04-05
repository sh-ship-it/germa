import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from "./lib/env.js";

const app = express();

const PORT = ENV.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (_, res) => {
  res.json({ status: "API is running" });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;
