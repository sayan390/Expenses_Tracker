import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    
    // Auto load user session if it exists on page refresh
    useEffect(() => {
        const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
    }, []);

    const persistAuth = (userObj, tokenStr, remember = false) => {
        try {
            if (remember) {
                if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
                if (tokenStr) localStorage.setItem("token", tokenStr);
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("token");
            } else {
                if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
                if (tokenStr) sessionStorage.setItem("token", tokenStr);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
            setUser(userObj || null);
            setToken(tokenStr || null);
        } catch (err) {
            console.error("persistAuth error:", err);
        }
    };

    const clearAuth = () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
        } catch (err) {
            console.error("clearAuth error: ", err);
        }
        setUser(null);
        setToken(null);
    };

    // FIXED: Parameter match name fixed from useData -> userData
    // FIXED: Function spelling fixed from persisAuth -> persistAuth
    const handleLogin = (userData, remember = false, tokenFromApi = null) => {
        persistAuth(userData, tokenFromApi, remember);
        navigate("/");
    };


    const handleSignup = (userData, remember = false, tokenFromApi = null) => {
        persistAuth(userData, tokenFromApi, remember);
        navigate("/");
    };

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };

    return (
        <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
             <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
            <Route element={<Layout user={user} onLogout={handleLogout} />}>
                <Route path="/" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default App;