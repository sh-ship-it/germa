import { createClient } from "redis";
import { ENV } from "./env.js";

const REDIS_URL = ENV?.REDIS_URL || process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: REDIS_URI,
  RESP: 2,
});

redisClient.on("connect", () => {
  console.log("REDIS CONNECTED:", REDIS_URL);
});

redisClient.on("error", (err) => {
  console.error("Error connecting to REDIS:", err);
});

redisClient.connect().catch((err) => {
  console.error("Error connecting to REDIS:", err);
});
