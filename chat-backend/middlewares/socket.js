import { io } from "socket.io-client";

const BASE_URL = "http://localhost:1337"; // Ensure this matches backend port

useEffect(() => {
  const socketInstance = io(BASE_URL, {
    transports: ["websocket"],
    withCredentials: true, // Ensures proper CORS handling
  });

  socketInstance.on("connect", () => {
    console.log("Connected to Socket.io server");
    socketInstance.emit("join", { username });
  });

  socketInstance.on("welcome", (data) => {
    console.log("Received welcome message:", data);
  });

  return () => {
    socketInstance.disconnect();
  };
}, []);
