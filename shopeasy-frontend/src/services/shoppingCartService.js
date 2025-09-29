import api from "./api";

export const addProductToCart = async (payload) => {
    try {
        const response = await api.post("/cart/add", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getCartItems = async () => {
    try {
        const response = await api.get("/cart/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const updateCartItem = async (itemId, payload) => {
    try {
        const response = await api.put(`/cart/update/${itemId}`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const removeCartItem = async (itemId) => {
    try {
        const response = await api.delete(`/cart/remove/${itemId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const clearCartItems = async () => {
    try {
        const response = await api.delete("/cart/clear/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const mergeGuestCart = async (payload) => {
    try {
        const response = await api.post("/cart/merge", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};