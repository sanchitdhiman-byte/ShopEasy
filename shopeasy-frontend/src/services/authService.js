import api from "./api";

export const registerUser = async (payload) => {
    try {
        const response = await api.post("/auth/register", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const loginUser = async (payload) => {
    try {
        const response = await api.post("/auth/login", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post("/auth/logout");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};