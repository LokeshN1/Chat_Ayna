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
                return { success: true, message: "Registration successful!" };

            } else {
                console.error("Registration error:", data);
                return { success: false, message: data.error.message || "Registration failed. Please check your details." };

            }
        } catch (error) {
            console.error("Network error during registration:", error);
            return { success: false, message: "Network error. Please try again later." };

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
                return { success: true, message: "Login successful!" };

            } else {
                console.error("Login error:", data);
                return { success: false, message: data.error.message || "Login failed. Please check your credentials." };
            }
        } catch (error) {
            console.error("Network error during login:", error);
            return { success: false, message: "Network error. Please try again later." };

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
