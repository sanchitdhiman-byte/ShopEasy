import { useEffect, useState } from "react";
import {useDarkMode} from "../context/themeContext.jsx";
import { getAllProducts } from "../services/productService.js";
import { getAllCategories } from "../services/categoryService.js";
import { Link } from "react-router-dom";
import Header from "../components/layout/header.jsx";
import phoneImage from '../assets/phone.png'
import AddToCart from "../components/addToCart.jsx";

function Homepage() {
    const { isDark } = useDarkMode();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    getAllCategories(),
                    getAllProducts(),
                ]);

                if (catRes.success) {
                    setCategories(catRes.data || []);
                } else {
                    setError(catRes.error || "Failed to fetch categories");
                }

                if (prodRes.success) {
                    setProducts(prodRes.data || []);
                } else {
                    setError(prodRes.error || "Failed to fetch products");
                }
            } catch (err) {
                console.error("Error fetching homepage data:", err);
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen text-xl font-semibold">
                Loading...
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex items-center justify-center min-h-screen text-xl font-semibold text-red-500">
                Error: {error}
            </main>
        );
    }

    return (
        <>
            <Header />
            <main className={`min-h-screen pt-24 px-6 py-10 transition-colors duration-300 ${
                    isDark
                        ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                        : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
                }`}>
                <section className="max-w-7xl mx-auto mb-14">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-extrabold tracking-wide">Browse Categories</h1>
                        <Link to="/categories"
                              className={`font-semibold transition flex ${
                                  isDark 
                                      ? "text-orange-400 hover:text-orange-300" 
                                      : "text-blue-600 hover:text-blue-500"
                              }`}>
                            View All <span className={"material-symbols-rounded"}>arrow_right_alt</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {categories.length > 0 ? (
                            categories.slice(0, 6).map((cat) => (
                                <Link key={cat.categoryId}
                                      to={`/category/${cat.categoryId}`}
                                      className={`h-32 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg cursor-pointer transition-transform hover:scale-105 hover:shadow-xl ${
                                          isDark 
                                              ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white" 
                                              : "bg-gradient-to-tr from-blue-400 to-indigo-500 text-white"
                                      }`}>
                                    {cat.categoryName}
                                </Link>
                            ))
                        ) : (
                            <div>No categories found</div>
                        )}
                    </div>
                </section>

                <section className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-extrabold tracking-wide">Browse Products</h1>
                        <Link to="/products"
                              className={`flex items-center justify-center font-semibold transition ${
                                  isDark 
                                      ? "text-orange-400 hover:text-orange-300" 
                                      : "text-blue-600 hover:text-blue-500"
                              }`}>
                            View All <span className={"material-symbols-rounded"}>arrow_right_alt</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.slice(0, 8).map((prod) => (
                                <Link key={prod.productId}
                                      to={`/product/${prod.productId}`}
                                      className={`rounded-2xl shadow-md hover:shadow-xl hover:scale-105 overflow-hidden cursor-pointer ${
                                          isDark 
                                              ? "bg-gray-900 border border-gray-700" 
                                              : "bg-white border border-gray-200"
                                      }`}>
                                    <img
                                        src={prod.imageUrl || phoneImage }
                                        alt={prod.productName}
                                        className="h-40 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <h2 className="font-semibold text-lg mb-2">{prod.productName}</h2>
                                        <p className="text-sm mb-3 opacity-70">
                                            {prod.description || "No description available."}
                                        </p>
                                        <AddToCart
                                            productId={prod.productId}
                                            onAddToCart={(cart) => {
                                                console.log("Cart updated:", cart);
                                            }}
                                            classes={`w-full py-2 rounded-lg font-semibold transition ${ isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-500 text-white" }`}
                                        />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div>No products found</div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Homepage;