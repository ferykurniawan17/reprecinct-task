import {
  CreateAttributeRequest,
  AttributesListResponse,
} from "@/modules/attribute/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const createAttributes = async (
  data: CreateAttributeRequest
): Promise<AttributesListResponse> => {
  const url = `${API_BASE_URL}/api/attribute`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create attributes: ${response.statusText}`);
  }
  const result = await response.json();
  return result;
};

export default createAttributes;
