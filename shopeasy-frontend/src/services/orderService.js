import api from "./api";

export const placeOrder = async (payload) => {
    try {
        const response = await api.post("/orders/", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get("/orders/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.put(`/orders/${orderId}/status`, null, { params: { status } });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await api.delete(`/orders/${orderId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};