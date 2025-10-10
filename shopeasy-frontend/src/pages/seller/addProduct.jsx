import { useEffect, useState } from "react";
import { useDarkMode } from "../../context/themeContext.jsx";
import { getAllCategories, createCategory } from "../../services/categoryService.js";
import api from "../../services/api.js";

export default function AddProduct() {
    const { isDark } = useDarkMode();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
    });

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [dragOver, setDragOver] = useState(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ categoryName: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setFilteredCategories(
            categories.filter((c) => c.categoryName.toLowerCase().includes(value.toLowerCase()))
        );
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleNewCategoryChange = (e) =>
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const filesArray = Array.from(files);

        if (name === "images") setImages((prev) => [...prev, ...filesArray]);
        else if (name === "videos") setVideos((prev) => [...prev, ...filesArray]);

        e.target.value = null;
    };


    const handleDrop = (e, type) => {
        e.preventDefault();
        setDragOver(null);
        const files = Array.from(e.dataTransfer.files);

        if (type === "images") setImages((prev) => [...prev, ...files]);
        else setVideos((prev) => [...prev, ...files]);
    };


    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeVideo = (index) => {
        setVideos(videos.filter((_, i) => i !== index));
    };

    const handleAddCategory = async () => {
        if (!newCategory.categoryName.trim()) {
            setMessage({ type: "error", text: "Category name cannot be blank." });
            return;
        }

        try {
            const created = await createCategory(newCategory);
            setCategories((prev) => [...prev, created]);
            setFilteredCategories((prev) => [...prev, created]);
            setForm({ ...form, categoryId: created.categoryId });
            setSearch(created.categoryName);
            setShowCategoryForm(false);
            setNewCategory({ categoryName: "", description: "" });
            setMessage({ type: "success", text: "Category created successfully." });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to create category.",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!form.name || !form.price || !form.stockQuantity || !form.categoryId || images.length === 0) {
            setMessage({ type: "error", text: "Please fill all mandatory fields." });
            return;
        }

        try {
            setLoading(true);
            const payload = new FormData();
            payload.append(
                "product",
                new Blob(
                    [
                        JSON.stringify({
                            name: form.name,
                            description: form.description,
                            price: parseFloat(form.price),
                            stockQuantity: parseInt(form.stockQuantity),
                            categoryId: form.categoryId,
                        }),
                    ],
                    { type: "application/json" }
                )
            );

            images.forEach((file) => payload.append("images", file));
            videos.forEach((file) => payload.append("videos", file));

            await api.post("/seller/product/add", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage({ type: "success", text: "Product added successfully!" });
            setForm({
                name: "",
                description: "",
                price: "",
                stockQuantity: "",
                categoryId: "",
            });
            setImages([]);
            setVideos([]);
            setSearch("");
        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to add product.",
            });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none transition-all duration-200 ${
        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
    }`;

    const dropZoneClass = (type) =>
        `border-2 border-dashed rounded-xl py-6 px-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            dragOver === type
                ? "border-orange-500 bg-orange-500/10"
                : isDark
                    ? "border-gray-700 bg-gray-800 hover:border-orange-500 hover:bg-gray-800/60"
                    : "border-gray-300 bg-gray-100 hover:border-orange-500 hover:bg-gray-50"
        }`;

    return (
        <div className={`min-h-screen flex items-center justify-center ${
                isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
            } transition-colors duration-500`}>
            <div className={`w-full max-w-2xl mt-10 mb-10 p-8 rounded-2xl shadow-2xl ${
                    isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
                }`}>
                <h2 className="text-3xl font-extrabold text-center mb-8 tracking-tight">
                    Add New Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text"
                           name="name"
                           placeholder="Product Name"
                           value={form.name}
                           onChange={handleChange}
                           className={inputClass} />

                    <textarea name="description"
                              rows="3"
                              placeholder="Product Description"
                              value={form.description}
                              onChange={handleChange}
                              className={inputClass} />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="number"
                               name="price"
                               placeholder="Price (₹)"
                               value={form.price}
                               onChange={handleChange}
                               className={inputClass} />
                        <input type="number"
                               name="stockQuantity"
                               placeholder="Stock Quantity"
                               value={form.stockQuantity}
                               onChange={handleChange}
                               className={inputClass} />
                    </div>

                    <div className="relative">
                        <input type="text"
                               value={
                                    form.categoryId
                                        ? categories.find((c) => c.categoryId === form.categoryId)
                                        ?.categoryName || ""
                                        : search
                               }
                               onChange={handleSearch}
                               onFocus={() => setIsDropdownOpen(true)}
                               placeholder="Search or select category"
                               className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none ${
                                   isDark 
                                       ? "bg-gray-800 border-gray-700 text-white" 
                                       : "bg-gray-100 border-gray-300 text-gray-900"
                               }`} />

                        {isDropdownOpen && (
                            <div className={`absolute z-10 w-full mt-2 rounded-xl shadow-lg max-h-56 overflow-y-auto ${
                                isDark
                                    ? "bg-gray-800 border border-gray-700"
                                    : "bg-white border border-gray-300"
                                }`}>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <div
                                            key={cat.categoryId}
                                            onClick={() => {
                                                setForm({ ...form, categoryId: cat.categoryId });
                                                setSearch(cat.categoryName);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2 cursor-pointer hover:bg-orange-500 hover:text-white ${
                                                isDark ? "text-gray-200" : "text-gray-900"
                                            }`}
                                        >
                                            {cat.categoryName}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">No categories found</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button type="button"
                                onClick={() => setShowCategoryForm(!showCategoryForm)}
                                className="text-orange-500 font-semibold hover:underline">
                            + {showCategoryForm ? "Cancel New Category" : "Create New Category"}
                        </button>
                    </div>

                    {showCategoryForm && (
                        <div className={`p-4 rounded-xl border ${
                            isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"
                        }`}>
                            <input type="text"
                                   name="categoryName"
                                   placeholder="Category Name"
                                   value={newCategory.categoryName}
                                   onChange={handleNewCategoryChange}
                                   className={`w-full mb-3 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none ${
                                       isDark
                                           ? "bg-gray-900 border-gray-700 text-white"
                                           : "bg-white border-gray-300 text-gray-900"
                                   }`} />
                            <textarea name="description"
                                      rows="2"
                                      placeholder="Category Description (optional)"
                                      value={newCategory.description}
                                      onChange={handleNewCategoryChange}
                                      className={`w-full mb-3 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none ${
                                          isDark
                                              ? "bg-gray-900 border-gray-700 text-white"
                                              : "bg-white border-gray-300 text-gray-900"
                                      }`} />
                            <button type="button"
                                    onClick={handleAddCategory}
                                    className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                                Create Category
                            </button>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className={dropZoneClass("images")}
                             onDrop={(e) => handleDrop(e, "images")}
                             onDragOver={(e) => {
                                 e.preventDefault();
                                 setDragOver("images");
                             }}
                             onDragLeave={() => setDragOver(null)}>
                            <input type="file"
                                   name="images"
                                   accept="image/*"
                                   multiple
                                   onChange={handleFileChange}
                                   className="hidden"
                                   id="imagesInput"/>
                            <label htmlFor="imagesInput"
                                   className="text-center text-sm font-medium cursor-pointer">
                                <span className="block text-lg font-semibold mb-1">Upload Product Images</span>
                                <span className="text-gray-500 text-sm">Click or drag files here</span>
                            </label>
                            {images.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt=""
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <button type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 text-[0.5px] opacity-0 group-hover:opacity-100">
                                                <span className={"material-symbols-rounded text-[0.5px]"}>close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={dropZoneClass("videos")}
                             onDrop={(e) => handleDrop(e, "videos")}
                             onDragOver={(e) => {
                                 e.preventDefault();
                                 setDragOver("videos");
                             }}
                             onDragLeave={() => setDragOver(null)}>
                            <input type="file"
                                   name="videos"
                                   accept="video/*"
                                   multiple
                                   onChange={handleFileChange}
                                   className="hidden"
                                   id="videosInput" />
                            <label htmlFor="videosInput"
                                   className="text-center text-sm font-medium cursor-pointer">
                                <span className="block text-lg font-semibold mb-1">Upload Product Videos</span>
                                <span className="text-gray-500 text-sm">Optional – click or drag here</span>
                            </label>
                            {videos.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                    {videos.map((vid, i) => (
                                        <div key={i} className="relative group">
                                            <video src={URL.createObjectURL(vid)} controls className="w-24 h-20 rounded-lg border" />
                                            <button type="button"
                                                    onClick={() => removeVideo(i)}
                                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 text-[0.5px] opacity-0 group-hover:opacity-100">
                                                <span className={"material-symbols-rounded text-[0.5px]"}>close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {message.text && (
                        <p className={`text-sm text-center font-medium ${
                                message.type === "error" ? "text-red-500" : "text-green-500"
                            }`}>
                            {message.text}
                        </p>
                    )}

                    <button type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105">
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
