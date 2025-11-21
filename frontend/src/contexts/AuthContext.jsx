import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch(`${backendUrl}/user/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    localStorage.removeItem("token");
                    setUser(null);
                    return errorData.message;
                }

                const value = await response.json();
                setUser(value.user);

            } catch (err) {
                console.error("Failed to get user", err);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return errorData.message || "Registration failed";
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);

            // Fetch /user/me after login
            const profileRes = await fetch(`${backendUrl}/user/me`, {
                headers: { "Authorization": `Bearer ${data.token}` }
            });

            if (!profileRes.ok) {
                const errorData = await profileRes.json();
                return errorData.message;
            }

            const profile = await profileRes.json();
            setUser(profile.user);

            navigate("/profile");
        } catch (err) {
            return "error";
        }
    };

    const register = async ({ username, firstname, lastname, password }) => {
        const response = await fetch(`${backendUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, firstname, lastname, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return errorData.message;
        }

        await response.json();

        navigate("/success");

        return "";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
