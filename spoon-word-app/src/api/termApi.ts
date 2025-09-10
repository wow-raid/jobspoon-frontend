import axiosInstance from "./axiosInstance";

export const fetchTermsByTag = async (tag: string, page = 1, size = 10) => {
    const { data } = await axiosInstance.get("/terms/search/by-tag", {
        params: { tag, page, size },
    });
    return data;
}