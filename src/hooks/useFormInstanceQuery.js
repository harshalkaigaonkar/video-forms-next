import { createForm } from "@/api-functions/formInstance.api";
import { useMutation } from "@tanstack/react-query";

export const useCreateFormInstanceQuery = ({ customConfig }) => {
  const formInstance = useMutation((data) => createForm(data), {
    ...customConfig,
  });

  return formInstance;
};
