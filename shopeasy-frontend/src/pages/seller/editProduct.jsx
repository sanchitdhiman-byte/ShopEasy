// src/pages/seller/EditProduct.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService.js";
import { updateProduct } from "../../services/sellerService.js";
import { getAllCategories } from "../../services/categoryService.js";
import { useDarkMode } from "../../context/themeContext.jsx";

function EditProduct() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { isDark } = useDarkMode();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
    });
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingVideos, setExistingVideos] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newVideos, setNewVideos] = useState([]);
    const [removeImageIds, setRemoveImageIds] = useState([]);
    const [removeVideoIds, setRemoveVideoIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    getProductById(productId),
                    getAllCategories(),
                ]);

                if (productRes.success && categoryRes.success) {
                    const product = productRes.data;

                    setForm({
                        name: product.productName || "",
                        description: product.description || "",
                        price: product.price || "",
                        stockQuantity: product.stockQuantity || "",
                        categoryId:
                            categoryRes.data.find(
                                (c) => c.categoryName === product.categoryName
                            )?.categoryId || "",
                    });

                    setExistingImages(product.imageUrls || []);
                    setExistingVideos(product.videoUrls || []);
                    setCategories(categoryRes.data);
                } else {
                    setError(productRes.error || categoryRes.error);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load product data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    console.log(1, form);
    console.log(2, categories);
    console.log(3, existingImages);
    console.log(4, existingVideos);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageRemove = (url) => {
        const id = url.split("/").pop().split("_")[0];
        setRemoveImageIds((prev) => [...prev, id]);
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const handleVideoRemove = (url) => {
        const id = url.split("/").pop().split("_")[0];
        setRemoveVideoIds((prev) => [...prev, id]);
        setExistingVideos((prev) => prev.filter((vid) => vid !== url));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateProduct(
                productId,
                form,
                newImages,
                newVideos,
                removeImageIds,
                removeVideoIds
            );

            alert("Product updated successfully!");
            navigate("/seller/products");
        } catch (err) {
            console.error(err);
            alert("Failed to update product. Check console for details.");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading product details...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div
            className={`min-h-screen pt-8 px-6 sm:px-10 lg:px-12 transition-colors duration-300 ${
                isDark
                    ? "bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white"
                    : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
            }`}
        >
            <h1 className="text-3xl font-bold mb-8 text-center">Edit Product</h1>

            <form
                onSubmit={handleSubmit}
                className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-lg ${
                    isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                }`}
            >
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border outline-none ${
                            isDark
                                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full px-4 py-2 rounded-lg border outline-none resize-none ${
                            isDark
                                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border outline-none ${
                            isDark
                                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Stock Quantity</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        min="0"
                        value={form.stockQuantity}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border outline-none ${
                            isDark
                                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Category</label>
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border outline-none ${
                            isDark
                                ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                        }`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {existingImages.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Existing Images</h3>
                        <div className="flex flex-wrap gap-3">
                            {existingImages.map((url) => (
                                <div key={url} className="relative w-28 h-28">
                                    <img
                                        src={"http://localhost:8080/uploads/images/41cfaf03-f291-44d9-8234-0accb90e8df0_realme_narzo_70.jpeg"}
                                        alt="Product"
                                        className="w-full h-full object-cover rounded-lg border"
                                    />
                                    <img
                                        src={"/41cfaf03-f291-44d9-8234-0accb90e8df0_realme_narzo_70.jpeg"}
                                        alt="Product"
                                        className="w-full h-full object-cover rounded-lg border"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleImageRemove(url)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {existingVideos.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Existing Videos</h3>
                        <div className="flex flex-wrap gap-3">
                            {existingVideos.map((url) => (
                                <div key={url} className="relative">
                                    <video
                                        src={url}
                                        controls
                                        className="w-40 rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleVideoRemove(url)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Add New Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setNewImages([...e.target.files])}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">Add New Videos</label>
                    <input
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={(e) => setNewVideos([...e.target.files])}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-purple-50 file:text-purple-700
                            hover:file:bg-purple-100"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/seller/products")}
                        className={`px-5 py-2 rounded-xl font-semibold transition-colors ${
                            isDark
                                ? "bg-gray-600 hover:bg-gray-700 text-white"
                                : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                        }`}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className={`px-5 py-2 rounded-xl font-semibold transition-colors ${
                            isDark
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;