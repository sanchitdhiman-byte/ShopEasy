import { useEffect, useState } from "react";
import { getAllCategories } from "../services/categoryService.js";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import { useDarkMode } from "../hooks/useDarkMode.jsx";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isDark } = useDarkMode();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                if (res.success) {
                    setCategories(res.data);
                } else {
                    setError(res.error || "Failed to load categories.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading)
        return (
            <main className="flex items-center justify-center min-h-screen text-lg font-semibold">
                Loading categories...
            </main>
        );

    if (error)
        return (
            <main className="flex items-center justify-center min-h-screen text-lg font-semibold text-red-500">
                {error}
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
                <section className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-extrabold tracking-wide font-[Poppins]">
                            Browse Categories
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <Link
                                    to={`/products?category=${cat.categoryId}`}
                                    key={cat.categoryId}
                                    className={`h-32 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg cursor-pointer transition-transform hover:scale-105 hover:shadow-xl ${
                                        isDark
                                            ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
                                            : "bg-gradient-to-tr from-blue-400 to-indigo-500 text-white"
                                    }`}
                                >
                                    {cat.categoryName}
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500">No categories found.</p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Categories;
