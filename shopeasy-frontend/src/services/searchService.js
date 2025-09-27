import api from "./api";

export const search = async (search) => {
    try {
        const response = await api.get("/search", { params: { search } });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};