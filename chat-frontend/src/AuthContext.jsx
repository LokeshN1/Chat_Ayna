// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/local/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                localStorage.setItem("token", data.jwt);
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                console.error("Registration error:", data);
            }
        } catch (error) {
            console.error("Network error during registration:", error);
        }
    };

    const login = async (identifier, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/local`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                localStorage.setItem("token", data.jwt);
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                console.error("Login error:", data);
            }
        } catch (error) {
            console.error("Network error during login:", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
