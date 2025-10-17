import api from "./api";

export const addProduct = async (payload) => {
    try {
        const response = await api.post("/products/", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getProductsBySellerId = async (sellerId) => {
    try {
        const response = await api.get(`/seller/${sellerId}/products`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getDashboardData = async () => {
    try {
        const response = await api.get("/seller/dashboard");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
}

export async function updateProduct(
    productId,
    productData,
    newImages = [],
    newVideos = [],
    removeImageIds = [],
    removeVideoIds = []
) {
    try {
        const formData = new FormData();

        formData.append(
            "product",
            new Blob([JSON.stringify(productData)], { type: "application/json" })
        );

        newImages.forEach((image) => {
            formData.append("newImages", image);
        });

        newVideos.forEach((video) => {
            formData.append("newVideos", video);
        });

        removeImageIds.forEach((id) => formData.append("removeImageIds", id));
        removeVideoIds.forEach((id) => formData.append("removeVideoIds", id));

        const response = await api.put(`/seller/${productId}/update`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;

    } catch (error) {
        console.error("Error updating product:", error);
        throw error.response?.data || error;
    }
}
