import {
  AttributeQueryOptions,
  AttributesListResponse,
} from "@/modules/attribute/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getAttributes = async (
  params: AttributeQueryOptions
): Promise<AttributesListResponse> => {
  const { limit, search = "" } = params;

  const url = `${API_BASE_URL}/api/attribute?limit=${limit}&search=${search}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch attributes: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export default getAttributes;
