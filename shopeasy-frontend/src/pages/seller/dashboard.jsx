import { useDarkMode } from "../../context/themeContext.jsx";
import { getDashboardData } from "../../services/sellerService.js";
import {useEffect, useState} from "react";

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
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Failed to fetch dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p>Loading dashboard stats...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-extrabold mb-8">Hey there!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index}
                         className={`p-6 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 ${
                             isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
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
