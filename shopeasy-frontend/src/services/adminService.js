import api from "./api";

export const getAdminDashboard = async () => {
    try {
        const response = await api.get("/admin/dashboard/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get("/admin/users");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const updateRole = async (userId, role) => {
    try {
        const response = await api.put(`/admin/users/${userId}/role/`, { role });
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
        const response = await api.delete(`/admin/users/${userId}/`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAllOrders = async () => {
    try {
        const response = await api.get("/admin/orders/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAllPayments = async () => {
    try {
        const response = await api.get("/admin/payments/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};