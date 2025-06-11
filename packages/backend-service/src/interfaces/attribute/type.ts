export interface AttributeResult {
  created: string[];
  skipped: string[];
}

// represent one attribute record
export interface Attribute {
  id: string;
  name: string;
}

export interface AttributeQueryOptions {
  limit?: number;
  search?: string;
}

export type CreateAttributeRequest = {
  attributes: string | string[];
};

export type CreateAttributeResponse = {
  created: string[];
  skipped: string[];
};

export interface AttributesListResponse {
  data: Attribute[];
  total: number;
}
