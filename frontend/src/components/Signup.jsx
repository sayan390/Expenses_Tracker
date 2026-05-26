import React, { useState } from 'react'
import { signupStyles } from '../assets/dummyStyles';

const Signup = ({API_URL = "http://localhost:4000", onSignup}) => {
      const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

      // To fetch the profile
    const fetchProfile = async (token) => {
        if (!token) return null;
        const res = await axios.get(`${API_URL}/user/me`, {
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

    // to validate that all fields are filled by user or not 

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

  // to signup


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if(!validateFrom()) return;

    setIsLoading(true);
    try {
        const res = await axios.post(
            '${API_URL}/api/user/register',
            { name, email, password },
            {headers: {"Content-Type": "application/json"}},
        );
        const data = res.data || {};
      const token = data.token ?? null;
      let profile = data.user ?? null;
      if (!profile) {
        // check for any extra fields returned that could be user info
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
          console.warn("onSignup threw:", callErr);
          navigate("/");
        }
      } else {
        navigate("/");
      }
      setPassword("");
    }
catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    }finally {
        setIsLoading(false);
    }
  };

  return (
       <div className={signupStyles.pageContainer}>
        <div className = {signupStyles.cardContainer}>
            <div className = {signupStyles.header}>
                <button onClick={() => navigate(-1)} className={signupStyles.backButton}>
                    <ArrowLeft className="w-5 h-5"/>
                </button>
                <div className={signupStyles.avatar}>
                    < User className="w-10 h-10 text-white"/>
                </div>
                <h1 className={signupStyles.headerTitle}> Create Account</h1>
                <p className={signupStyles.headerSubtitle}>
                    Join Expense Tracker to manage your finances
                </p>
            </div>
            <div className={signupStyles.fromContainer}>
                {errors.api && <p className={signupStyles.apiError}>{errors.api}</p>}

                <from onSubmit={handleSubmit} noValidate>
                    <div className="mb-6">
                        <label htmlFor="name" className={signupStyles.label}>
                            Full Name
                        </label>
                        <div className={signupStyles.inputContainer}>
                            <div className={signupStyles.inputIcon}>
                                <User className="w-5 h-5"/>
                            </div>
                            <>
                        </div>
                    </div>
                </from>
            </div>
        </div>
       </div>
  )
}

export default Signup