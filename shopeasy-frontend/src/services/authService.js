import axios from "axios";

export const registerUser = async (payload) => {
    const response = await axios.post(
        "http://localhost:8080/auth/register",
        payload,
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
    );
    return response.data;
};


export const loginUser = async (payload) => {
    const response = await axios.post(
        "http://localhost:8080/auth/login",
        payload,
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
    );
    return response.data;
};
