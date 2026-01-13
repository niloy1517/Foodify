import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://mental-gwen-myportfolioproject-727b9a2c.koyeb.app",
    withCredentials: true,
    headers: {'Content-Type': 'Application/json'}
})