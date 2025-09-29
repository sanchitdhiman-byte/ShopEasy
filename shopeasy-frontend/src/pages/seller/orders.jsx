// src/pages/seller/Orders.jsx
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService.js"; // adjust path

function Orders() {
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
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status } : o))
            );
        } else {
            alert(res.error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Orders</h1>
            <table className="min-w-full border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">Order ID</th>
                    <th className="p-2 border">Customer</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((o) => (
                    <tr key={o.id} className="border">
                        <td className="p-2 border">{o.id}</td>
                        <td className="p-2 border">{o.customerName}</td>
                        <td className="p-2 border">₹{o.total}</td>
                        <td className="p-2 border">{o.status}</td>
                        <td className="p-2 border">
                            <select
                                value={o.status}
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className="border rounded p-1"
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
    );
}

export default Orders;
