import api from "./api";

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