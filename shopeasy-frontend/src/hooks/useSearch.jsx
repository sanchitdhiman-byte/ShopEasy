import { useState, useCallback } from "react";
import axios from "axios";

export const useSearch = () => {
    const [results, setResults] = useState({ products: [], categories: [] });
    const [loading, setLoading] = useState(false);

    const search = useCallback(async (query) => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/search?search=${query}`, {
                withCredentials: true,
            });
            setResults(res.data);
        } catch (err) {
            console.error("Search error:", err.response?.data || err.message);
            setResults({ products: [], categories: [] });
        } finally {
            setLoading(false);
        }
    }, []);

    return { results, loading, search };
};
