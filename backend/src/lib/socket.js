import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createAdapter } from "@socket.io/redis-adapter";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import { redisClient } from "./redis.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling", "websocket"],
});

// Setup Redis adapter for cross-instance pub/sub synchronization
const pubClient = redisClient;
const subClient = pubClient.duplicate();

subClient.on("error", (err) => {
  console.error("Error connecting to REDIS (subClient):", err.message || err);
});

subClient.connect().catch((err) => {
  console.error("Error connecting to REDIS (subClient):", err.message || err);
});

io.adapter(createAdapter(pubClient, subClient));

io.use(socketAuthMiddleware);

const userSocketMap = {};

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", async (socket) => {
  console.log("a user connected ", socket.user.fullName);
  const userId = socket.userId?.toString() || socket.userId;
  userSocketMap[userId] = socket.id;

  try {
    await redisClient.hSet("online_users", userId, socket.id);
    const onlineUsers = await redisClient.hKeys("online_users");
    io.emit("getOnlineUsers", onlineUsers);
  } catch (error) {
    console.error("Error updating online users in Redis on connect:", error);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", async () => {
    console.log("a user disconnected ", socket.user.fullName);
    delete userSocketMap[userId];

    try {
      await redisClient.hDel("online_users", userId);
      const onlineUsers = await redisClient.hKeys("online_users");
      io.emit("getOnlineUsers", onlineUsers);
    } catch (error) {
      console.error("Error removing online user from Redis on disconnect:", error);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { server, io, app };