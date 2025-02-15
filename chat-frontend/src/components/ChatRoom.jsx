import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import socket from "../socket/socket.config";  // Import socket
import "../css/ChatRoom.css";

function ChatRoom() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.on("message", (data) => {
      updateMessages({ user: "Server", text: data.text });
    });

    return () => {
      socket.off("message");
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const savedMessages = localStorage.getItem(`chat_${user.username}`);
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, [user]);

  const updateMessages = (newMessage) => {
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      localStorage.setItem(`chat_${user.username}`, JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { user: user.username, text: message };
    updateMessages(newMessage);
    socket.emit("sendMessage", { user: user.username, message });
    setMessage("");
  };

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col w-full max-w-2xl h-[80vh] mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-700 px-4 py-3 text-lg font-semibold text-white">Chat Room</div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg max-w-xs ${msg.user === user.username ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-600 text-white self-start"}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center p-3 bg-gray-700">
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="ml-3 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
