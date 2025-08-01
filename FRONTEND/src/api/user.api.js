import axiosInstance from "../utils/axiosInstance"

const registerUser = async (userData) => {
    const { data } = await axiosInstance.post("/api/v1/user/register" , userData)
    return data;
}
const loginUser = async (userData) => {
    const response = await axiosInstance.post("/api/v1/user/login", userData);
    // console.log("Access Token:", response.data.data.accessToken);
    return response.data;
}
const logoutUser = async () => {
    await axiosInstance.get("/api/v1/user/logout")
}
const currentUser = async () => {
    const response = await axiosInstance.get("/api/v1/user/me")
    return response.data;
}
const getStats = async () => {
    const response = await axiosInstance.get("/api/v1/user/stats")
    return response.data;
}
export { 
    registerUser,
    loginUser,
    logoutUser,
    currentUser,
    getStats
}