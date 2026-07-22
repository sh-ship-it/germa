import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Derive socket URL from VITE_API_URL (strip "/api" suffix)
// Dev:  VITE_API_URL=http://localhost:8080/api → BASE_URL=http://localhost:8080
// Prod: VITE_API_URL=/api                     → BASE_URL=/  (same-origin via Vercel proxy)
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") || "/"
  : "http://localhost:8080";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isloggingIn: false,
  onlineUsers: [],
  socket:null,

  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
      
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });

    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  signup: async (Data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", Data);
      set({ authUser: res.data });
      //toast
      toast.success("account created successfully!🎉");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },
  
  login: async (Data) => {
    set({ isloggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", Data);
      set({ authUser: res.data });
      //toast
      toast.success("Logged in successfully!👋");
      
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      set({ isloggingIn: false });
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!👋");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "something went wrong");
    }
  },

  connectSocket: () => {
    const {authUser} = get() 
    if (!authUser || get().socket?.connected) return;
     const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
      transports: ["websocket"], // direct WebSocket connection bypasses proxy HTTP polling sticky session requirements
    });

    socket.connect();

    set({ socket });

    //listen for online users
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    })
    console.log("Socket connected:", socket.connected);
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket?.disconnect();
  }
}));
