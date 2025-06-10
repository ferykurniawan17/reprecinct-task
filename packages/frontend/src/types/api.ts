export interface Attribute {
  id: string;
  name: string;
}

export interface AttributeQueryOptions {
  limit?: number;
  search?: string;
}

export interface CreateAttributeRequest {
  attributes: string | string[];
}

export interface CreateAttributeResponse {
  created: string[];
  skipped: string[];
}

export interface AttributesListResponse {
  data: Attribute[];
  total: number;
}
