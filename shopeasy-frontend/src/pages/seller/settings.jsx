import { useEffect, useState } from "react";
import { getOwnProfile, updateProfile } from "../../services/userService.js";
import { useDarkMode } from "../../context/themeContext.jsx";

function Settings() {
    const { isDark } = useDarkMode();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ shopName: "", bankAccount: "" });

    const fetchProfile = async () => {
        const res = await getOwnProfile();
        if (res.success) {
            setProfile(res.data);
            setForm({
                shopName: res.data.shopName || "",
                bankAccount: res.data.bankAccount || "",
            });
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateProfile(form);
        if (res.success) {
            alert("Settings updated successfully");
            setProfile(res.data);
        } else {
            alert(res.error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading settings...</p>;

    return (
        <div className={`min-h-screen pt-6 px-6 sm:px-10 lg:px-12 transition-colors duration-300 ${
            isDark
                ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
        }`}>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block font-medium mb-1">Shop Name</label>
                    <input
                        type="text"
                        value={form.shopName}
                        onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                        className={`w-full border p-2 rounded ${isDark ? "bg-gray-800 text-white border-gray-600" : ""}`}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Bank Account</label>
                    <input
                        type="text"
                        value={form.bankAccount}
                        onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                        className={`w-full border p-2 rounded ${isDark ? "bg-gray-800 text-white border-gray-600" : ""}`}
                    />
                </div>
                <button
                    type="submit"
                    className={`px-4 py-2 rounded font-bold transition-colors ${
                        isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default Settings;
