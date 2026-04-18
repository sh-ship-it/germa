import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log(" socket connection rejected: No token provided");
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log(" socket connection rejected: Invalid token");
      return next(new Error("Authentication error"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    console.log(
      ` socket connection accepted: User ${user.username} (${user._id}) connected`,
    );
    next();
  } catch {
    console.log(" socket connection rejected: Authentication error");
    return next(new Error("Authentication error"));
  }
};
