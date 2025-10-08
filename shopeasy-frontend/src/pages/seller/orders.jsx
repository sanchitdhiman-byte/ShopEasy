import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService.js";
import { useDarkMode } from "../../context/themeContext.jsx";

function Orders() {
    const { isDark } = useDarkMode();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const res = await getAllOrders();
        if (res.success) setOrders(res.data);
        else console.error(res.error);
        setLoading(false);
    };

    const handleStatusChange = async (id, status) => {
        const res = await updateOrderStatus(id, status);
        if (res.success) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } else {
            alert(res.error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading orders...</p>;

    return (
        <div className={`min-h-screen pt-6 px-6 sm:px-10 lg:px-12 transition-colors duration-300 ${
            isDark
                ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
        }`}>
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            <div className="overflow-x-auto">
                <table className={`min-w-full border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <thead className={`${isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
                    <tr>
                        <th className="p-2 border">Order ID</th>
                        <th className="p-2 border">Customer</th>
                        <th className="p-2 border">Total</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(o => (
                        <tr key={o.id} className={`border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                            <td className="p-2 border">{o.id}</td>
                            <td className="p-2 border">{o.customerName}</td>
                            <td className="p-2 border">₹{o.total}</td>
                            <td className="p-2 border">{o.status}</td>
                            <td className="p-2 border">
                                <select
                                    value={o.status}
                                    onChange={e => handleStatusChange(o.id, e.target.value)}
                                    className={`border rounded p-1 ${isDark ? "bg-gray-800 text-white border-gray-600" : ""}`}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;
