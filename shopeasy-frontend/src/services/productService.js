import api from "./api";

export const getAllProducts = async () => {
    try {
        const response = await api.get("/products/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getProductById = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const updateProduct = async (productId, payload) => {
    try {
        const response = await api.put(`/products/${productId}/`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}/`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const addReview = async (productId, payload) => {
    try {
        const response = await api.post(`/products/${productId}/reviews/`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAllReviews = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}/reviews/`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};