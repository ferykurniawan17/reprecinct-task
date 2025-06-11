import { AttributeQueryOptions } from "@/modules/attribute/types/api";
import useQueryGetAttributes from "./useQueryGetAttributes";

type Props = {
  tableQueries: AttributeQueryOptions;
};

const useAttributesPage = ({ tableQueries }: Props) => {
  const { data, isFetching, refetch } = useQueryGetAttributes(tableQueries);

  return {
    data,
    isFetching,
    refetch,
  };
};

export default useAttributesPage;
