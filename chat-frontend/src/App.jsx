// src/App.jsx
import React, { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatPage from "./pages/ChatPage";
import { AuthContext } from "./AuthContext";
import { ChatSessionProvider } from "./context/ChatSessionContext";

function App() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChatSessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
          <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ChatSessionProvider>
  );
}

export default App;
