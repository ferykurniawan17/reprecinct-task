import {
  Attribute,
  AttributeQueryOptions,
  CreateAttributeResponse,
} from "@/modules/attribute/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchAttributes = async (
  options: AttributeQueryOptions = {}
): Promise<Attribute[]> => {
  const { limit = 10, search = "" } = options;
  const params = new URLSearchParams();

  if (limit > 0) params.append("limit", limit.toString());
  if (search) params.append("search", search);

  const response = await fetch(
    `${API_BASE_URL}/attribute?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch attributes");
  }

  const data = await response.json();
  return data.data || data; // Handle different response formats
};

export const createAttributes = async (
  attributes: string[]
): Promise<CreateAttributeResponse> => {
  const response = await fetch(`${API_BASE_URL}/attribute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ attributes }),
  });

  if (!response.ok) {
    throw new Error("Failed to create attributes");
  }

  const result = await response.json();
  return result.data || result;
};
