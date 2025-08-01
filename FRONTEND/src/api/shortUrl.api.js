import axiosInstance from "../utils/axiosInstance";


const createShortUrl = async (url, slug) => {
    const { data } = await axiosInstance.post("/create-shorturl-auth", {url, slug})
    console.log(data)
    return data;
}
const getRecentUrls = async ( ) => {
    const response = await axiosInstance.get("/recenturls")
    return response.data;
}

export { createShortUrl, getRecentUrls }