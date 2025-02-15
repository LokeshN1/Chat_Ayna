import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import ChatRoom from "../components/ChatRoom";
import { Navigate } from "react-router-dom";

const ChatPage = () => {
  const { user, setUser } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-semibold">Welcome, {user.username}</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 text-sm rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex-grow flex justify-center items-center p-4">
        <ChatRoom />
      </div>
    </div>
  );
};

export default ChatPage;
