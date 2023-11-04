import axiosInstance from "@/lib/axios";

export const createForm = async (data) => {
  const result = await axiosInstance.post("/create-form", data);
  return result.data;
};
