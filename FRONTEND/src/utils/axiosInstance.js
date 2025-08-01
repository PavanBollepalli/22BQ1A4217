import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://urlshortner-afmm.onrender.com",
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to handle cookies
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure credentials are included
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

