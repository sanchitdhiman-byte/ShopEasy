import { useCart } from "../context/cartContext.jsx";
import { useDarkMode } from "../context/themeContext.jsx";
import Header from "../components/layout/header.jsx";
import { useState, useEffect } from "react";

function Cart() {
    const { cart, addToCart, removeFromCart } = useCart();
    const { isDark } = useDarkMode();
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const sum = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
        setTotal(sum);
    }, [cart]);

    const increment = (item) => {
        addToCart({ ...item, quantity: 1 }); // add 1 more
    };

    const decrement = (item) => {
        if (item.quantity > 1) {
            addToCart({ ...item, quantity: -1 }); // subtract 1
        } else {
            removeFromCart(item.productId);
        }
    };


    if (cart.length === 0) {
        return (
            <>
                <Header />
                <main className={`min-h-screen pt-24 px-6 py-10 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
                    <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={`min-h-screen pt-24 px-6 py-10 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
                <div className="max-w-5xl mx-auto">
                    {cart.map(item => (
                        <div key={item.productId} className={`flex items-center justify-between p-4 mb-4 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-300 flex items-center justify-center rounded-lg">
                                    <img src={item.imageUrl || "https://via.placeholder.com/80"} alt={item.productName} className="w-full h-full object-cover rounded-lg"/>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">{item.productName}</h2>
                                    <p className="mt-1 font-medium">₹{item.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => decrement(item)}
                                        className={`px-3 py-1 rounded-lg font-semibold ${isDark ? "bg-blue-800 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"}`}>
                                    -
                                </button>
                                <span className="px-3 py-1">{item.quantity || 1}</span>
                                <button onClick={() => increment(item)}
                                        className={`px-3 py-1 rounded-lg font-semibold ${isDark ? "bg-blue-800 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"}`}>
                                    +
                                </button>
                                <button onClick={() => removeFromCart(item.productId)}
                                        className={`px-3 py-1 rounded-lg font-semibold ${isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-100 hover:bg-red-200 text-red-800"}`}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 flex justify-between items-center p-4 rounded-lg shadow-md font-bold text-lg">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>

                    <button className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
                        Checkout
                    </button>
                </div>
            </main>
        </>
    );
}

export default Cart;
