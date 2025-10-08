import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/productService.js";
import { useDarkMode } from "../../context/themeContext.jsx";
import { useNavigate } from "react-router-dom";

function Products() {
    const { isDark } = useDarkMode();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        const res = await getAllProducts();
        if (res.success) setProducts(res.data);
        else console.error(res.error);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const res = await deleteProduct(id);
            if (res.success) setProducts((prev) => prev.filter(p => p.productId !== id));
            else alert(res.error);
        }
    };

    const handleEdit = (id) => navigate(`/seller/products/edit/${id}`);

    const handleAdd = () => navigate(`/seller/products/add`);

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading products...</p>;

    return (
        <div className={`min-h-screen pt-6 px-6 sm:px-10 lg:px-12 transition-colors duration-300 ${
            isDark
                ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
        }`}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Products</h1>
                <button
                    onClick={handleAdd}
                    className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                        isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                >
                    + Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.productId} className={`rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl ${
                            isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                        }`}>
                            <img src={product.imageUrl || "https://via.placeholder.com/300"} alt={product.productName} className="h-48 w-full object-cover" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="font-semibold text-lg mb-2">{product.productName}</h2>
                                {product.description && <p className={`text-sm mb-3 opacity-70 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{product.description.slice(0, 60)}...</p>}
                                <p className="font-bold mb-2 text-lg">₹{product.price.toLocaleString()}</p>
                                <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Stock: {product.stockQuantity}</p>

                                <div className="flex gap-2 mt-auto">
                                    <button onClick={() => handleEdit(product.productId)} className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                                        isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                                    }`}>Edit</button>
                                    <button onClick={() => handleDelete(product.productId)} className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                                        isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                                    }`}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : <div>No products found.</div>}
            </div>
        </div>
    );
}

export default Products;
