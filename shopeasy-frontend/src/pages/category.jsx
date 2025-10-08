import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryById } from "../services/categoryService.js";
import { getProductsByCategory, getChildCategories } from "../services/categoryService.js";
import Header from "../components/layout/header.jsx";
import { useCart } from "../context/cartContext.jsx";
import AddToCart from "../components/AddToCart.jsx";

function Category() {
    const { id } = useParams();
    console.log("Category ID:", id);
    const [category, setCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const { cart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await getCategoryById(id);
                setCategory(categoryData);
                console.log("Category Data:", categoryData);

                if (categoryData?.subCategories) {
                    setSubCategories(categoryData.subCategories);
                }

                const productData = await getProductsByCategory(id, {
                    includeSubcategories: true,
                });
                setProducts(productData.data);
                console.log("Product Data:", productData);
            } catch (error) {
                console.error("Error loading category page:", error);
            }
        };

        fetchData();
    }, [id]);

    if (!category) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div>
            <Header />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-Poppins">
                    {category.name}
                </h1>

                {subCategories.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-Roboto">
                            Subcategories
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {subCategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    to={`/category/${sub.id}`}
                                    className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm text-center"
                                >
                                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 text-OpenSans">
                                        {sub.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-Roboto">
                        Products
                    </h2>
                    {products.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">
                            No products found in this category.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div key={product.productId}
                                     className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 hover:shadow-lg transition">
                                    <img src={product.imageUrl || "/placeholder.png"}
                                         alt={product.productName}
                                         className="w-full h-48 object-cover rounded-xl mb-4"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-Poppins">
                                        {product.productName}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-OpenSans">
                                        ₹{product.price}
                                    </p>
                                    <AddToCart product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Category;