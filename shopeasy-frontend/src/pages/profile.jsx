import { useState, useEffect } from "react";
import { getOwnProfile, updateProfile } from "../services/userService.js";
import { toast } from "react-hot-toast";
import { useDarkMode } from "../context/themeContext.jsx";
import Header from "../components/layout/header.jsx";

const Profile = () => {
    const [user, setUser] = useState(null);
    const { isDark } = useDarkMode();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        const res = await getOwnProfile();
        if (res.success) {
            setUser(res.data);
            setFormData({ name: res.data.name, email: res.data.email });
        } else {
            toast.error(res.error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateProfile(formData);
        if (res.success) {
            toast.success("Profile updated successfully!");
            setUser(res.data);
            setEditMode(false);
        } else {
            toast.error(res.error);
        }
        setLoading(false);
    };

    if (!user) return <p className="text-center mt-20 text-lg">Loading profile...</p>;

    return (
        <>
            <Header />
            <div className={`min-h-screen pt-24 px-6 flex justify-center transition-colors duration-500 ${
                    isDark
                        ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
                }`}>
                <div className={`w-full max-w-3xl p-8 rounded-2xl shadow-2xl backdrop-blur-lg border transition-all duration-500 ${
                        isDark
                            ? "bg-blue-900/40 border-gray-700"
                            : "bg-white/70 border-gray-200"
                    }`}>
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                            <img src={user.profilePicture || "https://via.placeholder.com/100"}
                                 alt="Profile"
                                 className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                            />
                            <span className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            <span className={`inline-block px-3 py-1 text-sm rounded-full mt-3 ${
                                    isDark ? "bg-blue-800 text-white" : "bg-blue-100 text-blue-700"
                                }`}>
                                Role: {user.role}
                            </span>
                        </div>
                    </div>

                    {editMode ? (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block font-medium mb-1">Name</label>
                                <input type="text"
                                       name="name"
                                       value={formData.name}
                                       onChange={handleChange}
                                       className={`w-full border p-3 rounded-lg focus:ring-2 transition ${
                                           isDark 
                                               ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500" 
                                               : "bg-white border-gray-300 focus:ring-blue-400"
                                       }`}
                                       required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Email</label>
                                <input type="email"
                                       name="email"
                                       value={formData.email}
                                       onChange={handleChange}
                                       className={`w-full border p-3 rounded-lg focus:ring-2 transition ${
                                           isDark 
                                               ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500" 
                                               : "bg-white border-gray-300 focus:ring-blue-400"
                                       }`}
                                       required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full shadow-lg transition disabled:opacity-70">
                                    <span className="material-symbols-rounded">save</span>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button"
                                        onClick={() => setEditMode(false)}
                                        className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full shadow-lg transition">
                                    <span className="material-symbols-rounded">cancel</span>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg shadow-lg transition"
                            >
                                <span className="material-symbols-rounded">edit</span>
                                Edit Profile
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    window.location.href = "/login";
                                }}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition"
                            >
                                <span className="material-symbols-rounded">logout</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
