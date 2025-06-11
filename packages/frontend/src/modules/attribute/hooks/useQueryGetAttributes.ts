import { useQuery } from "@tanstack/react-query";
import getAttributes from "../fetchers/getAttributes";
import { AttributeQueryOptions } from "@/modules/attribute/types/api";

const useQueryGetAttributes = (params: AttributeQueryOptions) => {
  return useQuery({
    queryKey: ["attributes", params],
    queryFn: () => getAttributes(params),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export default useQueryGetAttributes;
