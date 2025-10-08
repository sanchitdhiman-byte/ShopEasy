import React from "react";
import { useCart } from "../context/cartContext.jsx";
import { useDarkMode } from "../context/themeContext.jsx";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { isDark } = useDarkMode();

    return (
        <div
            className={`h-full rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                isDark
                    ? "bg-gray-900 border border-gray-700 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
            }`}
        >
            {/* Product Image */}
            <img
                src={product.imageUrl || "https://via.placeholder.com/300"}
                alt={product.productName}
                className="h-48 w-full object-cover"
            />

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-lg mb-2">{product.productName}</h2>
                {product.description && (
                    <p className={`text-sm mb-3 opacity-70 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {product.description.slice(0, 60)}...
                    </p>
                )}
                <p className="font-bold mb-4 text-lg">₹{product.price.toLocaleString()}</p>

                <button
                    onClick={() => addToCart(product)}
                    className={`mt-auto w-full py-2 rounded-xl font-bold transition-transform transform hover:scale-105 ${
                        isDark
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gradient-to-tr from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600"
                    }`}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
