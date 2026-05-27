import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'; 
import { signupStyles } from '../assets/dummyStyles';

const Signup = ({ API_URL = "http://localhost:4000", onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async (token) => {
    if (!token) return null;
    const res = await axios.get(`${API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (token) storage.setItem("token", token);
      if (profile) storage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Storage Error:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return; 

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/user/register`, 
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      const data = res.data || {};
      const token = data.token ?? null;
      let profile = data.user ?? null;
      
      if (!profile) {
        const copy = { ...data };
        delete copy.token;
        delete copy.user;
        if (Object.keys(copy).length) profile = copy;
      }

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetchErr) {
          console.warn("Could not fetch profile after signup token:", fetchErr);
          profile = null;
        }
      }

      if (!profile) profile = { name, email };
      persistAuth(profile, token);
      
      if (typeof onSignup === "function") {
        try {
          onSignup(profile, rememberMe, token);
        } catch (callErr) {
          console.warn("onSignup callback failed:", callErr);
          navigate("/");
        }
      } else {
        navigate("/");
      }
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer || "min-h-screen bg-gray-100 flex items-center justify-center p-4"}>
      <div className={signupStyles.cardContainer || "w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"}>
        
        {/* Header Block Matches Image */}
        <div className={signupStyles.header || "bg-teal-800 text-white p-6 text-center relative"}>
          <button onClick={() => navigate(-1)} className={signupStyles.backButton || "absolute left-4 top-6 text-white/80 hover:text-white"}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={signupStyles.avatar || "w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className={signupStyles.headerTitle || "text-2xl font-bold font-sans"}>Create Account</h1>
          <p className={signupStyles.headerSubtitle || "text-teal-100 text-sm mt-1"}>
            Join Expense Tracker to manage your finances
          </p>
        </div>
        
        <div className={signupStyles.fromContainer || "p-6 bg-gray-50/50"}>
          {errors.api && <p className={signupStyles.apiError || "text-red-500 text-sm mb-4 text-center font-medium"}>{errors.api}</p>}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* Full Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className={signupStyles.label || "block text-gray-700 text-sm font-semibold mb-1"}>
                Full Name
              </label>
              <div className={signupStyles.inputContainer || "relative flex items-center"}>
                <div className={signupStyles.inputIcon || "absolute left-3 text-gray-400 pointer-events-none"}>
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  // Added pl-10 directly to prevent the text overlap shown in your screenshot
                  className={`${signupStyles.nameInput || 'w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600'} pl-10 ${
                    errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className={signupStyles.fieldError || "text-red-500 text-xs mt-1"}>{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className={signupStyles.label || "block text-gray-700 text-sm font-semibold mb-1"}>
                Email Address
              </label>
              <div className={signupStyles.inputContainer || "relative flex items-center"}>
                <div className={signupStyles.inputIcon || "absolute left-3 text-gray-400 pointer-events-none"}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Added pl-10 directly to prevent the text overlap shown in your screenshot
                  className={`${signupStyles.emailInput || 'w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600'} pl-10 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  placeholder="your@example.com"
                />
              </div>
              {errors.email && (
                <p className={signupStyles.fieldError || "text-red-500 text-xs mt-1"}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className={signupStyles.label || "block text-gray-700 text-sm font-semibold mb-1"}>
                Password
              </label>
              <div className={signupStyles.inputContainer || "relative flex items-center"}>
                <div className={signupStyles.inputIcon || "absolute left-3 text-gray-400 pointer-events-none"}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Added pl-10 and pr-10 directly to wrap text safely between both icons
                  className={`${signupStyles.passwordInput || 'w-full px-3 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-600'} pl-10 pr-10 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle || "absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className={signupStyles.fieldError || "text-red-500 text-xs mt-1"}>{errors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className={signupStyles.checkboxContainer || "flex items-center gap-2 mb-6"}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={signupStyles.checkbox || "rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"}
              />
              <label htmlFor="remember" className={signupStyles.checkboxLabel || "text-sm text-gray-600 select-none cursor-pointer"}>
                Remember Me
              </label>
            </div>

            {/* Submit Button matches image look */}
            <button
              type="submit"
              className={`${signupStyles.button || 'w-full py-3 bg-teal-600 text-white rounded-lg font-medium shadow-md hover:bg-teal-700 transition duration-200'} ${
                isLoading ? (signupStyles.buttonDisabled || "opacity-50 cursor-not-allowed") : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className={`animate-spin h-5 w-5 text-white ${signupStyles.spinner || ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form> 
          <div className={signupStyles.signupContainer}>
            <p className={signupStyles.signupInText}>
              Already Have an Account?{" "}
              <Link to="/login" className={signupStyles.signInLink}>
              Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;