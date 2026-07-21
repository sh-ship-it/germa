import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const baseURL = rawUrl.endsWith("/api") || rawUrl.endsWith("/api/")
  ? rawUrl
  : `${rawUrl.replace(/\/+$/, "")}/api`;

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});
