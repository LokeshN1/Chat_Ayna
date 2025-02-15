import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import ChatRoom from "../components/ChatRoom";
import { Navigate } from "react-router-dom";

const ChatPage = () => {
  const { user, setUser } = useContext(AuthContext); // Get setUser to clear user on logout

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    setUser(null); // Clear user from context
    localStorage.removeItem("user"); // Remove user from local storage
    localStorage.removeItem("token"); // Remove token from local storage
  };

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <ChatRoom />
    </div>
  );
};

export default ChatPage;
