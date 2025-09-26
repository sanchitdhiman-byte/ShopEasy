import api from "./api";

export const getProducts = () => api.get("/products");
export const getCategories = () => api.get("/categories");
