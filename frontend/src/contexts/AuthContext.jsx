import React, { createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// TODO: get the BACKEND_URL.
const backendUrl = import.meta.env.VITE_BACKEND_URL; // Vite


/*
 * This provider should export a `user` context state that is 
 * set (to non-null) when:
 *     1. a hard reload happens while a user is logged in.
 *     2. the user just logged in.
 * `user` should be set to null when:
 *     1. a hard reload happens when no users are logged in.
 *     2. the user just logged out.
 */
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    // const user = null; // TODO: Modify me.
    const [user, setUser] = useState(null);


    useEffect( () => {
        // TODO: complete me, by retriving token from localStorage and make an api call to GET /user/me.
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if(!token) {return;}
        
            try {
                const response = await fetch(`${backendUrl}/user/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    //expired token
            
                    // Get error message from server response
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
        
    }, [])

    /*
     * Logout the currently authenticated user.
     *
     * @remarks This function will always navigate to "/".
     */
    const logout = () => {
        // TODO: complete me
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    /**
     * Login a user with their credentials.
     *
     * @remarks Upon success, navigates to "/profile". 
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {string} - Upon failure, Returns an error message.
     */
    const login = async (username, password) => {
        // TODO: complete me
        // return "TODO: complete me";

        try {
            const response = await fetch(`${backendUrl}/login`, {
                    method: "POST",
                    headers : {"Content-type": "application/json"},
                    body: JSON.stringify({username, password})
                }
            );
            
        if (!response.ok) {
            // Get error message from server response
            const errorData = await response.json();
            return errorData.message || "Registration failed";
        }

            // add data to local storage
            const data = await response.json();
            localStorage.setItem("token", data.token);

            // Update the user context state.
            // Fetch user profile after login
            const profileRes = await fetch(`${backendUrl}/user/me`, {
                headers: { "Authorization": `Bearer ${data.token}` }
            });

            if (!response.ok) {
                // Get error message from server response
                const errorData = await response.json();
                return errorData.message;
            }


            
            const profile = await profileRes.json();
            setUser(profile.user);
        
            // redirect the user to /profile.
            navigate("/profile")


        } catch (err) {
            return "error"
        }
    };

    /**
     * Registers a new user. 
     * 
     * @remarks Upon success, navigates to "/".
     * @param {Object} userData - The data of the user to register.
     * @returns {string} - Upon failure, returns an error message.
     */
    const register = async ({username, firstname, lastname, password }) => {
        // TODO: complete me
        // return "TODO: complete me";
        const response = await fetch(`${backendUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, firstname, lastname, password })
        });




        if (!response.ok) {
            // Get error message from server response
            const errorData = await response.json();
            return errorData.message;
        }

        const data = await response.json();
        return data.response;

    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
