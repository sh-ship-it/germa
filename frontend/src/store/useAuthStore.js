import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isloggingIn: false,
  
  logout:async()=>{
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!👋");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
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

    } catch (error) {
      toast.error(error.response.data.message);
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

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isloggingIn: false });
    }
  },
}));
