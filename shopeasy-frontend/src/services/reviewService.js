import api from "./api";

export const updateReview = async (reviewId, payload) => {
    try {
        const response = await api.put(`/reviews/${reviewId}/`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await api.delete(`/reviews/${reviewId}/`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};