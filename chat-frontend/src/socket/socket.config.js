import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(BASE_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => console.log("✅ Connected to WebSocket Server"));
socket.on("disconnect", () => console.log("❌ Disconnected from WebSocket Server"));

export default socket;
