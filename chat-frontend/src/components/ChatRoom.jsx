import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import socket from "../socket/socket.config";
import { v4 as uuidv4 } from "uuid";
import '../css/ChatRoom.css'

function ChatRoom() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");

  useEffect(() => {
    if (!user) return;

    // Load stored sessions
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
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-4xl h-full bg-gray-800 rounded-lg shadow-lg flex flex-col p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Chat Room</h2>

          <div className="flex items-center space-x-4">
            {/* Dropdown for Session Selection */}
            {sessions.length > 0 && (
              <div className="relative">
                <select 
                  className="bg-gray-700 text-white px-4 py-2 rounded-md"
                  value={sessionId || ""}
                  onChange={(e) => switchSession(e.target.value)}
                >
                  <option disabled value="">Select Session</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* End Session Button */}
            {sessionId && (
              <button 
                className="bg-red-500 text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                onClick={endSession}>
                End Session
              </button>
            )}

            {/* Start New Session (only visible if at least one session exists) */}
            {sessions.length > 0 && (
              <button
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
                onClick={() => document.getElementById("newSessionModal").showModal()}>
                + New Session
              </button>
            )}
          </div>
        </div>

        {/* Show "Start New Session" Only When No Sessions Exist */}
        {sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1">
            <p className="text-gray-300">No sessions yet. Start a new chat session:</p>
            <input
              type="text"
              placeholder="Enter session name..."
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              className="mt-3 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            />
            <button
              onClick={startNewSession}
              className="mt-3 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
              Start New Session
            </button>
          </div>
        )}

        {/* Chat Messages (only when a session exists) */}
        {sessionId && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
              {messages.length === 0 && <p className="text-center text-gray-400">No messages yet...</p>}
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-2 rounded-lg text-sm ${msg.user === user.username ? "bg-blue-500 ml-auto" : "bg-gray-600"}`}>
                  <strong>{msg.user}: </strong>{msg.text}
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex p-3 bg-gray-700">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-3 py-2 rounded-l-md bg-gray-600 text-white outline-none"
              />
              <button 
                onClick={sendMessage} 
                className="px-4 py-2 bg-blue-500 rounded-r-md hover:bg-blue-600 transition">
                Send
              </button>
            </div>
          </>
        )}

        {/* Modal for Creating New Session */}
        <dialog id="newSessionModal" className="bg-gray-800 p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Start New Session</h3>
          <input
            type="text"
            placeholder="Enter session name..."
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <div className="flex justify-end mt-3">
            <button className="mr-2 px-4 py-2 bg-gray-600 rounded" onClick={() => document.getElementById("newSessionModal").close()}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600" onClick={startNewSession}>
              Create
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default ChatRoom;
