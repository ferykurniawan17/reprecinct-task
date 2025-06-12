import { Request, Response } from "express";
import {
  createAttributes,
  getAttributes,
} from "../../services/attribute/AttributeServices";
import { ApiRequest, ApiResponse } from "../../shared/types/api";
import { CreateAttributeRequest, CreateAttributeResponse } from "./type";

/**
 * Handler for creating new attributes
 * Accepts either a single string or an array of strings as attributes
 * Returns the list of created and skipped attributes
 */
export const createAttributesApiHandler = async (
  req: ApiRequest<CreateAttributeRequest>,
  res: ApiResponse<CreateAttributeResponse>
): Promise<void> => {
  let items: string[] = [];
  const { attributes } = req.body;
  if (typeof attributes === "string") items = [attributes];
  else if (Array.isArray(attributes)) items = attributes;
  else {
    res.status(400).json({ error: "Error: invalid body format" });
    return;
  }

  const { created, skipped } = await createAttributes(items);

  const response = {
    data: {
      created,
      skipped,
    },
  };

  res.json(response);
};

/**
 * Handler for filtering and retrieving attributes
 * Supports optional limit and search query parameters
 * Returns paginated list of attributes with total count
 */
export const filterAttributesApiHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { limit, search } = req.query as Record<string, string | undefined>;

  const attributes = await getAttributes({
    limit: parseInt(limit || "0"),
    search,
  });

  res.json(attributes);
};
