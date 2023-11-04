import axiosInstance from "@/lib/axios";

export const submitResponses = async (data) => {
  const result = await axiosInstance.post("/submit-answers", data);
  return result.data;
};
