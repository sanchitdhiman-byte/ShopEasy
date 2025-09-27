import api from "./api";

export const createAddress = async (payload) => {
    try {
        const response = await api.post("/users/me/addresses/", payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAllAddresses = async () => {
    try {
        const response = await api.get("/users/me/addresses/");
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const getAddressById = async (addressId) => {
    try {
        const response = await api.get(`/users/me/addresses/${addressId}/`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const updateAddress = async (addressId, payload) => {
    try {
        const response = await api.put(`/users/me/addresses/${addressId}/`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

export const deleteAddress = async (addressId) => {
    try {
        const response = await api.delete(`/users/me/addresses/${addressId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};