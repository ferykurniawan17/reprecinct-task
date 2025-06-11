import { useMutation, useQueryClient } from "@tanstack/react-query";
import createAttributes from "../fetchers/createAttributes";
import { CreateAttributeRequest } from "@/modules/attribute/types/api";

const useMutationCreateAttributes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttributeRequest) => createAttributes(data),
    onSuccess: () => {
      // Invalidate and refetch attributes query after successful creation
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: (error) => {
      console.error("Error creating attributes:", error);
    },
  });
};

export default useMutationCreateAttributes;
