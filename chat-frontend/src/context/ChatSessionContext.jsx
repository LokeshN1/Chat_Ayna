// src/context/ChatSessionContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getChatSession, saveChatSession, clearChatSession } from "../utils/sessionStorage";

export const ChatSessionContext = createContext();

export const ChatSessionProvider = ({ children }) => {
    const [chatSession, setChatSession] = useState(getChatSession());

    useEffect(() => {
        saveChatSession(chatSession);
    }, [chatSession]);

    const startNewSession = (sessionId) => {
        setChatSession({ sessionId, messages: [] });
    };

    const addMessageToSession = (message) => {
        setChatSession((prev) => ({
            ...prev,
            messages: [...prev.messages, message]
        }));
    };

    const endSession = () => {
        clearChatSession();
        setChatSession(null);
    };

    return (
        <ChatSessionContext.Provider value={{ chatSession, startNewSession, addMessageToSession, endSession }}>
            {children}
        </ChatSessionContext.Provider>
    );
};
