"use strict";
const { Server } = require("socket.io");

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ A user connected!");

      socket.on("sendMessage", (data) => {
        console.log("📩 Received message:", data);

        // Echo the same message back to the sender
        socket.emit("message", {
          user: data.user,
          text: data.message,
        });

        console.log("🔄 Sent message back:", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ A user disconnected!");
      });
    });

    strapi.io = io; // Store io instance in Strapi
  },
};
