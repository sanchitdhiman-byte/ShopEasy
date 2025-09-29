// src/pages/seller/Settings.jsx
import { useEffect, useState } from "react";
import { getOwnProfile, updateProfile } from "../../services/userService.js"; // adjust path

function Settings() {
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

    if (loading) return <p>Loading settings...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block font-medium">Shop Name</label>
                    <input
                        type="text"
                        value={form.shopName}
                        onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Bank Account</label>
                    <input
                        type="text"
                        value={form.bankAccount}
                        onChange={(e) =>
                            setForm({ ...form, bankAccount: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default Settings;
