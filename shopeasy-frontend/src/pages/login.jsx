import shopEasyLogoDark from "../assets/shopeasy-logo-dark-mode-no-bg.png";
import shopEasyLogoLight from "../assets/shopeasy_logo-no-bg.png";
import { useDarkMode } from "../hooks/useDarkMode.jsx";
import "../index.css";
import { loginUser } from "../services/authService.js";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const { isDark, toggleDarkMode } = useDarkMode();
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        accountType: "BUYER",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!form.password) {
            setError("Password is required");
            return;
        }
        if (!["BUYER", "SELLER"].includes(form.accountType)) {
            setError("Please select a valid account type");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const payload = {
                email: form.email,
                password: form.password,
                role: form.accountType.toUpperCase(),
            };
            const response = await loginUser(payload);
            console.log(response.data.role);
            if (!response.success) {
                throw new Error("Invalid Credentials");
            }

            login({
                token: response.data.token,
                user: {
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                },
            });

            setForm({
                email: "",
                password: "",
                accountType: "BUYER",
            });

            if (response.data.role === "SELLER") {
                navigate("/seller/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            setError(err.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDark ? "from-gray-900 via-gray-800 to-black" : "from-gray-100 via-gray-200 to-white"} transition-colors duration-500`}>
            <div className="flex justify-center mb-6 fixed top-5 left-20">
                <Link to="/" className="flex items-center" aria-label="Go to ShopEasy homepage">
                    <img src={isDark ? shopEasyLogoDark : shopEasyLogoLight}
                         alt="ShopEasy Logo"
                         className="w-40 h-40 drop-shadow-lg"
                    />
                </Link>
            </div>
            <div className={`w-full max-w-md ${isDark ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-300"} backdrop-blur-md rounded-2xl shadow-2xl p-8 border transition-colors duration-500 select-none`}>
                <h1 className={`text-3xl font-extrabold text-center ${isDark ? "text-white" : "text-gray-900"} mb-10 tracking-wide select-none`}>
                    Sign In
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email"
                           name="email"
                           value={form.email}
                           onChange={handleChange}
                           placeholder="Enter your email address"
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
                           required
                    />
                    <div className="relative flex items-center justify-center">
                        <input type={showPassword ? "text" : "password"}
                               name="password"
                               value={form.password}
                               onChange={handleChange}
                               placeholder="Enter your password"
                               className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
                               required
                        />
                        <button type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-5/9 -translate-y-1/2">
                            <span className={`material-symbols-rounded ${isDark ? "text-white" : "text-black"}`}>{showPassword ? "visibility_off" : "visibility"}</span>
                        </button>
                    </div>
                    <div className={`relative border ${isDark ? "border-gray-700" : "border-gray-300"} rounded-xl`}>
                        <select className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"} focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none pr-8 transition-colors`}
                                name="accountType"
                                value={form.accountType}
                                onChange={handleChange}
                                required>
                            <option value="BUYER">Buyer</option>
                            <option value="SELLER">Seller</option>
                        </select>
                        <span className={`material-symbols-rounded absolute right-1 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-300" : "text-gray-900"} pointer-events-none transition-colors`}>
                            arrow_drop_down
                        </span>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button type="submit"
                            disabled={loading}
                            className={`w-full py-3 mt-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}>
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2 text-white"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24">
                                    <circle className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4">
                                    </circle>
                                    <path className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z">
                                    </path>
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                <p className={`mt-6 text-center ${isDark ? "text-gray-400" : "text-gray-600"} select-none transition-colors`}>
                    Don't have an account?{" "}
                    <Link to="/register"
                          className={`${isDark ? "text-orange-400" : "text-orange-600"} hover:opacity-80 font-semibold transition-colors`}>
                        Register
                    </Link>
                </p>
            </div>
            <div>
                <button className={`fixed top-5 right-5 flex items-center justify-center ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"} w-10 h-10 rounded-full shadow-lg transition-all duration-200`}
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

export default Login;