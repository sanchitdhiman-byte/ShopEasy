import api from "./api";

export const initiatePayment = async (payload) => {
    try {
        const response = await api.post("/payments/", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const verifyPayment = async (payload) => {
    try {
        const response = await api.post("/payments/verify", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getPaymentDetails = async (paymentId) => {
    try {
        const response = await api.get(`/payments/${paymentId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAllPayments = async (params = {}) => {
    try {
        const response = await api.get("/payments/", { params });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const refundPayment = async (paymentId, reason) => {
    try {
        const response = await api.post(`/payments/${paymentId}/refund`, { reason });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};