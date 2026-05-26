import React, { useEffect, useState, useRef } from 'react';
import { navbarStyles } from "../assets/dummyStyles";
import img1 from "../assets/logo.png";
import { ChevronDown, User, LogOut } from 'lucide-react'; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

const Navbar = ({ user: propUser, onLogout }) => {
    const navigate = useNavigate();
    const menuRef = useRef();
    const [menuOpen, setMenuOpen] = useState(false);
    
    // ✅ FIX 1: Dedicated state for API fetched data only
    const [fetchedUser, setFetchedUser] = useState(null);

    // Fetch the user data from server ONLY if parent prop didn't supply it
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(`${BASE_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // Inspecting common backend wrappers (response.data.user vs response.data)
                const userData = response.data.user || response.data;
                if (userData) {
                    setFetchedUser(userData);
                }
            } catch (error) {
                console.error("Failed to load profile via API", error);
            }
        };

        // If parent hasn't passed down a valid name/email, pull it from the API
        if (!propUser || (!propUser.name && !propUser.email)) {
            fetchUserData();
        }
    }, [propUser]); // Runs again if parent properties transition

    // ✅ FIX 2: Compute current active user predictably. Prop always takes priority.
    const currentUser = propUser && (propUser.name || propUser.email) ? propUser : fetchedUser;

    // ✅ FIX 3: Robust Fallback assessment. Eliminates empty string configuration bugs ("")
    const displayName = currentUser?.name?.trim() || currentUser?.username?.trim() || "User";
    const displayEmail = currentUser?.email?.trim() || "user@expensetracker.com";
    const avatarLetter = displayName[0]?.toUpperCase() || "U";

    const toggleMenu = () => setMenuOpen(prev => !prev);

    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem("token");
        onLogout?.();
        navigate("/login");
    };

    // Close the toggle menu if clicked outside the box
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={navbarStyles.header}>
            <div className={navbarStyles.container}>

                {/* Logo */}
                <div
                    onClick={() => navigate("/")}
                    className={navbarStyles.logoContainer}
                >
                    <div className={navbarStyles.logoImage}>
                        <img src={img1} alt="logo" />
                    </div>
                    <span className={navbarStyles.logoText}>
                        Expenses Tracker
                    </span>
                </div>

                {/* User Section */}
                <div className={navbarStyles.userContainer} ref={menuRef}>

                    <button
                        onClick={toggleMenu}
                        className={navbarStyles.userButton}
                    >
                        <div className="relative">
                            <div className={navbarStyles.userAvatar}>
                                {avatarLetter}
                            </div>
                            <div className={navbarStyles.statusIndicator}></div>
                        </div>

                        <div className={navbarStyles.userTextContainer}>
                            <p className={navbarStyles.userName}>
                                {displayName}
                              </p>
                            <p className={navbarStyles.userEmail}>
                                {displayEmail}
                            </p>
                        </div>

                        <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
                    </button>

                    {/* Dropdown */}
                    {menuOpen && (
                        <div className={navbarStyles.dropdownMenu}>
                            <div className={navbarStyles.dropdownHeader}>
                                <div className="flex items-center gap-3">
                                    <div className={navbarStyles.dropdownAvatar}>
                                        {avatarLetter}
                                    </div>
                                    <div>
                                        <div className={navbarStyles.dropdownName}>
                                            {displayName}
                                        </div>
                                        <div className={navbarStyles.dropdownEmail}>
                                            {displayEmail}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={navbarStyles.menuItemContainer}>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate("/profile");
                                    }}
                                    className={navbarStyles.menuItem}
                                >
                                    <User className="w-4 h-4" />
                                    <span>My Profile</span>
                                </button>
                            </div>

                            <div className={navbarStyles.menuItemBorder}>
                                <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                                    <LogOut className=" w-4 h-4 " />
                                    <span>Log Out</span>
                                </button>
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;