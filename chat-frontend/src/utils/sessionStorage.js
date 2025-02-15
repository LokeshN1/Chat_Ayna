// src/utils/sessionStorage.js

const SESSION_KEY = "chat_session";

export const getChatSession = () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

export const saveChatSession = (session) => {
    if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
};

export const clearChatSession = () => {
    localStorage.removeItem(SESSION_KEY);
};
