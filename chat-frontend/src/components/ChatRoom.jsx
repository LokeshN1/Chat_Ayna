import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../AuthContext";
import socket from "../socket/socket.config";
import { v4 as uuidv4 } from "uuid";
import "../css/ChatRoom.css";
import Navbar from "./Navbar"; // Import the Navbar component

function ChatRoom() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");
  const [showMobileSessions, setShowMobileSessions] = useState(false); // State for mobile session menu
  const messagesEndRef = useRef(null);

  // Get the current session name
  const currentSessionName = sessionId
    ? sessions.find((s) => s.id === sessionId)?.name || "ChatRoom"
    : "ChatRoom";

  useEffect(() => {
    if (!user) return;

    const storedSessions = JSON.parse(localStorage.getItem(`sessions_${user.username}`)) || [];
    setSessions(storedSessions);

    if (storedSessions.length > 0) {
      const lastSession = storedSessions[storedSessions.length - 1];
      setSessionId(lastSession.id);
      loadMessages(lastSession.id);
    }

    socket.on("message", (data) => {
      updateMessages({ user: "Server", text: data.text });
    });

    return () => {
      socket.off("message");
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = (id) => {
    const savedMessages = localStorage.getItem(id);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
  };

  const startNewSession = () => {
    if (!newSessionName.trim()) return;

    const sessionId = `session-${uuidv4()}`;
    const newSession = { id: sessionId, name: newSessionName.trim() };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem(`sessions_${user.username}`, JSON.stringify(updatedSessions));

    setSessionId(sessionId);
    setMessages([]);
    setNewSessionName("");
    document.getElementById("newSessionModal").close();
  };

  const endSession = () => {
    if (!sessionId) return;
    localStorage.removeItem(sessionId);

    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem(`sessions_${user.username}`, JSON.stringify(updatedSessions));

    setSessionId(null);
    setMessages([]);
  };

  const switchSession = (id) => {
    setSessionId(id);
    loadMessages(id);
    setShowMobileSessions(false); // Close mobile session menu after switching
  };

  const updateMessages = (newMessage) => {
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      localStorage.setItem(sessionId, JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const sendMessage = () => {
    if (!message.trim() || !sessionId) return;
    const newMessage = { user: user.username, text: message };
    updateMessages(newMessage);
    socket.emit("sendMessage", { user: user.username, message });
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Visible on larger screens) */}
        <div className="hidden md:flex flex-col w-1/4 bg-gray-800 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold">Sessions</h2>
          <select
            onChange={(e) => switchSession(e.target.value)}
            value={sessionId || ""}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
          >
            <option value="" disabled>
              Select a session
            </option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => document.getElementById("newSessionModal").showModal()}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md"
          >
            + New Session
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col flex-1 p-4 overflow-hidden">
          {/* Chat Header */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-700">
            <h2 className="text-xl font-bold">{currentSessionName}</h2> {/* Display current session name */}
            <div className="flex items-center space-x-4">
              {/* Mobile Session Menu Button (Visible on small screens) */}
              <button
                onClick={() => setShowMobileSessions(!showMobileSessions)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {sessionId && (
                <button
                  onClick={endSession}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  End Session
                </button>
              )}
            </div>
          </div>

          {/* Mobile Session Menu (Visible on small screens) */}
          {showMobileSessions && (
            <div className="md:hidden bg-gray-800 p-4 rounded-lg mt-3">
              <h2 className="text-lg font-bold mb-3">Sessions</h2>
              <select
                onChange={(e) => switchSession(e.target.value)}
                value={sessionId || ""}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
              >
                <option value="" disabled>
                  Select a session
                </option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => document.getElementById("newSessionModal").showModal()}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md"
              >
                + New Session
              </button>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg mt-3">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-2 ${msg.user === user.username ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-md text-white ${
                      msg.user === user.username ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  >
                    <span className="block text-sm text-gray-300">{msg.user}</span>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          {sessionId && (
            <div className="p-3 bg-gray-900 border-t border-gray-700 flex">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-3 bg-gray-700 border rounded-md text-white"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating New Session */}
      <dialog id="newSessionModal" className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Start New Session</h3>
        <input
          type="text"
          placeholder="Enter session name..."
          value={newSessionName}
          onChange={(e) => setNewSessionName(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => document.getElementById("newSessionModal").close()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={startNewSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Start
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default ChatRoom;