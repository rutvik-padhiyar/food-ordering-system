import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const loginUser = (data) => API.post("/auth/login", data);

export const addFood = (data, token) =>
    API.post("/food/add", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });