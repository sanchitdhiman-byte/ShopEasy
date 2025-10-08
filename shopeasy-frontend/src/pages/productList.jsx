import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService.js";
import Header from "../components/layout/Header.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useDarkMode } from "../context/themeContext.jsx";
import {Link} from "react-router-dom";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isDark } = useDarkMode();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getAllProducts();
                if (res.success) {
                    setProducts(res.data);
                } else {
                    setError(res.error || "Failed to load products.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading)
        return <p className="text-center mt-10 text-xl font-semibold">Loading products...</p>;
    if (error)
        return (
            <p className="text-center mt-10 text-xl font-semibold text-red-500">
                {error}
            </p>
        );

    return (
        <div className={`min-h-screen mt-14 transition-colors duration-300 ${
                isDark ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
            }`}>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold tracking-wide font-[Poppins]">
                        Browse Products
                    </h1>
                    <Link
                        to="/"
                        className={`flex items-center justify-center font-semibold transition ${
                            isDark
                                ? "text-orange-400 hover:text-orange-300"
                                : "text-blue-600 hover:text-blue-500"
                        }`}
                    >
                        ← Back to Home
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <ProductCard key={product.productId || index} product={product} />
                        ))
                    ) : (
                        <div>No products found</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;
