// src/pages/seller/Products.jsx
import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/productService.js";
import {useDarkMode} from "../../hooks/useDarkMode.jsx"; // adjust path

function Products() {
    const { isDark, toggleDarkMode } = useDarkMode();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        const res = await getAllProducts();
        if (res.success) {
            setProducts(res.data);
        } else {
            console.error(res.error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const res = await deleteProduct(id);
            if (res.success) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
            } else {
                alert(res.error);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <table className="min-w-full border">
                <thead>
                <tr className={ isDark ? "bg-gray-800" : "bg-gray-100" }>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Stock</th>
                    <th className="p-2 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => (
                    <tr key={p.productId} className="border">
                        <td className="p-2 border">{p.productId}</td>
                        <td className="p-2 border">{p.productName}</td>
                        <td className="p-2 border">₹{p.price}</td>
                        <td className="p-2 border">{p.stock}</td>
                        <td className="p-2 border">
                            <button onClick={() => handleDelete(p.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Products;
