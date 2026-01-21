import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://foodify-backend-8a60.onrender.com/api",
    withCredentials: true,
    headers: {'Content-Type': 'Application/json'}
})
