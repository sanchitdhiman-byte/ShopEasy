import { useEffect, useState } from "react";
import { useDarkMode } from "../../context/themeContext.jsx";
import { getDashboardData } from "../../services/sellerService.js";

function Dashboard() {
    const { isDark } = useDarkMode();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getDashboardData();

                setStats([
                    { title: "Total Sales", value: `₹${data.data.totalSales.toLocaleString()}`, gradient: "from-green-400 to-green-600" },
                    { title: "Total Orders", value: data.data.totalOrders, gradient: "from-blue-400 to-indigo-500" },
                    { title: "Products Listed", value: data.data.productsListed, gradient: "from-purple-500 to-pink-500" },
                    { title: "Pending Orders", value: data.data.pendingOrders, gradient: "from-orange-400 to-red-500" },
                ]);
            } catch (err) {
                setError("Failed to fetch dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading dashboard stats...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className={`min-h-screen pt-6 px-6 sm:px-10 lg:px-12 transition-colors duration-300 ${
            isDark
                ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
        }`}>
            <h1 className="text-3xl font-extrabold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className={`p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl ${
                        isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}>
                        <h2 className="text-lg font-semibold mb-3">{stat.title}</h2>
                        <p className={`text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} text-transparent bg-clip-text`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
