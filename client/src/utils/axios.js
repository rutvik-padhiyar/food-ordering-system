import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // backend port 5000 pe chal raha hai
});

// ✅ agar user login hai to token auto add ho jaye
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // login ke baad token store hoga
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;