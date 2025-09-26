import shopEasyLogoDark from "../assets/shopeasy-logo-dark-mode-no-bg.png";
import shopEasyLogoLight from "../assets/shopeasy_logo-no-bg.png";
import { useDarkMode } from "../hooks/useDarkMode.jsx";
import "../index.css"
import {loginUser} from "../services/authService.js";
import {useState} from "react";
import {useAuth} from "../context/authContext.jsx";
import {Link} from "react-router-dom";

function Login() {
    const { isDark, toggleDarkMode } = useDarkMode();

    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
        accountType: "BUYER", // default
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            const payload = {
                email: form.email,
                password: form.password,
                role: form.accountType.toUpperCase(),
            };

            const data = await loginUser(payload);

            login({
                token: data.token,
                user: {
                    userId: data.userId,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                },
            })

            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
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
                    Login
                </h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="email"
                           name="email"
                           placeholder="Enter a valid email address"
                           value={form.email}
                           onChange={handleChange}
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none`}/>

                    <div className={`relative border ${isDark ? "border-gray-700" : "border-gray-300"} rounded-xl`}>
                        <select className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"} focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none pr-8`}
                                value={form.accountType}
                                onChange={handleChange}
                                defaultValue="">
                            <option value="" disabled>Select Role</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                        <span className={`material-symbols-rounded absolute right-1 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-300" : "text-gray-900"} pointer-events-none`}>
                            arrow_drop_down
                        </span>
                    </div>

                    <input type="password"
                           name="password"
                           placeholder="Enter password"
                           value={form.password}
                           onChange={handleChange}
                           className={`w-full px-4 py-3 rounded-xl ${isDark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700" : "bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300"} border focus:ring-2 focus:ring-purple-500 focus:outline-none`}/>

                    { error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-103">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className={`mt-6 text-center ${isDark ? "text-gray-400" : "text-gray-600"} select-none`}>
                    Don't have an account?{" "}
                    <Link to="/register"
                       className={`${isDark ? "text-orange-400 hover:text-purple-300" : "text-orange-600 hover:opacity-80"} font-semibold`}>
                        Register
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

export default Login;