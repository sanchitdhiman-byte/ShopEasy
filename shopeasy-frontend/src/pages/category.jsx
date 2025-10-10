import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryById, getProductsByCategory, getChildCategories } from "../services/categoryService.js";
import Header from "../components/layout/header.jsx";
import { useCart } from "../context/cartContext.jsx";
import { useDarkMode } from "../context/themeContext.jsx";
import AddToCart from "../components/AddToCart.jsx";

function Category() {
    const { isDark } = useDarkMode();
    const { id } = useParams();
    const [category, setCategory] = useState();
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const { cart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await getCategoryById(id);
                setCategory(categoryData.data);

                const subCategoriesData = await getChildCategories(id);
                setSubCategories(subCategoriesData.data);

                const productData = await getProductsByCategory(id);
                setProducts(productData.data);
                console.log(productData.data);
            } catch (error) {
                console.error("Error loading category page:", error);
            }
        };
        fetchData();
    }, [id]);

    console.log(products);

    if (!category) {
        return (
            <p
                className={`text-center mt-20 text-lg font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                }`}
            >
                Loading category details...
            </p>
        );
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${
                isDark
                    ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                    : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
            }`}
        >
            <Header />

            <main className="container mx-auto px-6 pt-28 pb-16 transition-all duration-300">
                {/* === Category Header === */}
                <div className="text-center mb-14">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 uppercase">
                        {category.categoryName}
                    </h1>

                    {category.description && (
                        <p
                            className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-light ${
                                isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            {category.description}
                        </p>
                    )}

                    <div
                        className={`mt-6 h-1 w-24 mx-auto rounded-full ${
                            isDark ? "bg-white/80" : "bg-black/80"
                        }`}
                    ></div>
                </div>

                {/* === Subcategories Section === */}
                {subCategories.length > 0 && (
                    <section className="mb-16">
                        <h2
                            className={`text-2xl sm:text-3xl font-bold mb-8 border-b pb-2 inline-block ${
                                isDark ? "border-gray-700" : "border-gray-300"
                            }`}
                        >
                            Explore Subcategories
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {subCategories.map((sub) => (
                                <Link
                                    key={sub.categoryId}
                                    to={`/category/${sub.categoryId}`}
                                    className={`p-6 rounded-2xl text-center shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                                        isDark
                                            ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                                            : "bg-white border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <p className="text-lg font-semibold tracking-wide uppercase">
                                        {sub.categoryName}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* === Product Grid Section === */}
                <section>
                    <h2
                        className={`text-2xl sm:text-3xl font-bold mb-8 border-b pb-2 inline-block ${
                            isDark ? "border-gray-700" : "border-gray-300"
                        }`}
                    >
                        Products
                    </h2>

                    {products.length === 0 ? (
                        <p
                            className={`text-lg italic ${
                                isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            No products found in this category.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div
                                    key={product.productId}
                                    className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ${
                                        isDark
                                            ? "bg-gray-900 border border-gray-800"
                                            : "bg-white border border-gray-200"
                                    }`}
                                >
                                    {/* Product Image */}
                                    <div className="relative">
                                        <img
                                            src={product.imageUrl || "/placeholder.png"}
                                            alt={product.productName}
                                            className="w-full h-56 object-cover rounded-t-2xl"
                                        />
                                        <span
                                            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
                                                isDark
                                                    ? "bg-white/20 text-white border border-gray-600"
                                                    : "bg-black/70 text-white"
                                            }`}
                                        >
                                            ₹{product.price}
                                        </span>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-5 flex flex-col justify-between min-h-[150px]">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                                {product.productName}
                                            </h3>
                                            <p
                                                className={`text-sm line-clamp-2 ${
                                                    isDark
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {product.description ||
                                                    "No description available."}
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <AddToCart product={product} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Category;
