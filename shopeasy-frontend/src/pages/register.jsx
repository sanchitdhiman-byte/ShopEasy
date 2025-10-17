import shopEasyLogoDark from "../assets/shopeasy-logo-dark-mode-no-bg.png";
import shopEasyLogoLight from "../assets/shopeasy_logo-no-bg.png"
import { useDarkMode } from "../hooks/useDarkMode.jsx";
import "../index.css"
import {registerUser} from "../services/authService.js";
import {useEffect, useState} from "react";
import {useAuth} from "../context/authContext.jsx";
import {Link, useNavigate } from "react-router-dom";

function Register() {
    const { isDark, toggleDarkMode } = useDarkMode();

    const { login, user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        accountType: "BUYER",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && user && user.role === "BUYER") {
            navigate("/");
        } else if (token && user && user.role === "SELLER") {
            navigate("/seller/dashboard");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^[0-9]{10}$/.test(form.phone)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            setError("");

            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: form.accountType.toUpperCase(),
                password: form.password,
            };

            const res = await registerUser(payload);

            if (res.success) {
                const { token, userId, name, email, role } = res.data;

                login({
                    token,
                    user: {
                        userId,
                        name,
                        email,
                        role,
                    },
                });

                if (res.data.role === "SELLER") {
                    navigate("/seller/dashboard");
                } else if (res.data.role === "BUYER") {
                    navigate("/");
                }
            } else {
                console.log(res.error.response.data.message);
                setError(res.error.response.data.message || "Registration failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDark ? "from-gray-900 via-gray-800 to-black" : "from-gray-100 via-gray-200 to-white"} transition-colors duration-500`}>

            <div className="flex justify-center mb-6 fixed top-5 left-20">
                <Link to="/" className="flex items-center">
                    <img src={isDark ? shopEasyLogoDark : shopEasyLogoLight}
                         alt="ShopEasy Logo"
                         className="w-40 h-40 drop-shadow-lg" />
                </Link>
            </div>

            <div className={`w-full max-w-md ${isDark ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-300"} backdrop-blur-md rounded-2xl shadow-2xl p-8 border transition-colors duration-500 select-none`}>

                <h1 className={`text-3xl font-extrabold text-center ${isDark ? "text-white" : "text-gray-900"} mb-10 tracking-wide select-none`}>
                    Create an Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name"
                           value={form.name}
                           onChange={handleChange}
                           placeholder="Enter your name"
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`} />

                    <input type="email" name="email"
                           value={form.email}
                           onChange={handleChange}
                           placeholder="Enter a valid email address"
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`} />

                    <input type="tel"
                           name="phone"
                           value={form.phone}
                           onChange={handleChange}
                           placeholder="Enter your phone number"
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`} />

                    <div className={`relative border ${isDark ? "border-gray-700" : "border-gray-300"} rounded-xl`}>
                        <select className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"} focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none pr-8 transition-colors`}
                                name="accountType"
                                value={form.accountType}
                                onChange={handleChange}>
                            <option value="" disabled>Select Account Type</option>
                            <option value="BUYER">Buyer</option>
                            <option value="SELLER">Seller</option>
                        </select>
                        <span className={`material-symbols-rounded absolute right-1 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-300" : "text-gray-900"} pointer-events-none transition-colors`}>
                            arrow_drop_down
                        </span>
                    </div>

                    <input type="password"
                           name="password"
                           value={form.password}
                           onChange={handleChange}
                           placeholder="Enter a strong password"
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`} />

                    <input type="password"
                           name="confirmPassword"
                           value={form.confirmPassword}
                           onChange={handleChange}
                           placeholder="Confirm your password"
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`} />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-103">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className={`mt-6 text-center ${isDark ? "text-gray-400" : "text-gray-600"} select-none transition-colors`}>
                    Already have an account?{" "}
                    <Link to="/login"
                       className={`${isDark ? "text-orange-400" : "text-orange-600"} hover:opacity-80 font-semibold transition-colors`}>
                        Login
                    </Link>
                </p>
            </div>

            <div>
                <button className={`fixed top-5 right-5 flex items-center justify-center ${isDark ? "bg-gray-700 hover:bg-gray-600" : "hover:bg-gray-400"} w-10 h-10 rounded-full shadow-[0_0_10px_2px_rgba(0,0,0,0.3)] transition-all duration-200`}
                        onClick={toggleDarkMode}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
                    <span className={`material-symbols-rounded ${isDark ? "text-white" : "text-gray-900"} text-lg select-none`}>
                        {isDark ? "light_mode" : "dark_mode"}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default Register;