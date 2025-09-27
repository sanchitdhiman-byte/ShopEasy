import api from "./api";

export const getOwnProfile = async () => {
    try {
        const response = await api.get("/users/me");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const updateProfile = async (payload) => {
    try {
        const response = await api.put("/users/me", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getUsersByRole = async (role) => {
    try {
        const response = await api.get("/users/", { params: { role } });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getReviewsByUser = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/reviews/`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};