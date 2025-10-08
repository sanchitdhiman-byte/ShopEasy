import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService.js";
import { useCart } from "../context/cartContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import Header from "../components/layout/header.jsx";
import { toast } from "react-hot-toast";
import { useDarkMode } from "../context/themeContext.jsx";

const Product = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { isDark } = useDarkMode();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        setLoading(true);
        const res = await getProductById(id);
        if (res.success) {
            setProduct(res.data);
        } else {
            toast.error(res.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading)
        return (
            <main className="flex items-center justify-center min-h-screen text-lg font-semibold">
                Loading product...
            </main>
        );

    if (!product)
        return (
            <main className="flex items-center justify-center min-h-screen text-lg font-semibold text-red-500">
                Product not found.
            </main>
        );

    return (
        <>
            <Header />
            <main
                className={`min-h-screen pt-24 px-6 py-10 transition-colors duration-300 ${
                    isDark
                        ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
                }`}
            >
                <div className="max-w-6xl mx-auto">
                    <div
                        className={`grid md:grid-cols-2 gap-10 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${
                            isDark
                                ? "bg-gray-900 border border-gray-700"
                                : "bg-white border border-gray-200"
                        }`}
                    >
                        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800">
                            <img
                                src={product.imageUrl || "https://via.placeholder.com/400"}
                                alt={product.productName}
                                className="max-h-[420px] object-cover hover:scale-105 transition-transform"
                            />
                        </div>

                        <div className="p-6 flex flex-col justify-between space-y-6">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-wide font-[Poppins] mb-3">
                                    {product.productName}
                                </h1>
                                <p className="text-2xl font-semibold text-green-600 mb-4">
                                    ₹{product.price}
                                </p>
                                <p
                                    className={`text-[Open Sans] leading-relaxed ${
                                        isDark ? "text-gray-300" : "text-gray-700"
                                    }`}
                                >
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-blue-700 transition shadow-md"
                                >
                                    🛒 Add to Cart
                                </button>
                                <button className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-green-700 transition shadow-md">
                                    ⚡ Buy Now
                                </button>
                                {user?.role === "SELLER" && (
                                    <Link
                                        to={`/edit-product/${product.productId}`}
                                        className="w-full sm:w-auto bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-yellow-600 transition shadow-md text-center"
                                    >
                                        ✏️ Edit Product
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`mt-12 p-6 rounded-2xl shadow-md transition-colors duration-300 ${
                            isDark
                                ? "bg-gray-900 border border-gray-700"
                                : "bg-white border border-gray-200"
                        }`}
                    >
                        <h2 className="text-2xl font-bold font-[Poppins] mb-4">
                            ⭐ Customer Reviews
                        </h2>
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {product.reviews.map((rev, idx) => (
                                    <div
                                        key={idx}
                                        className={`pb-3 last:border-0 ${
                                            isDark
                                                ? "border-b border-gray-700"
                                                : "border-b border-gray-200"
                                        }`}
                                    >
                                        <p className="font-semibold">{rev.userName}</p>
                                        <p
                                            className={`text-sm ${
                                                isDark
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {rev.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Product;
