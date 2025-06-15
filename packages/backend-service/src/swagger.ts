import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reprecinct Backend Service API",
      version: "0.1.0",
      description: "API documentation for Reprecinct Backend Service",
      contact: {
        name: "API Support",
        email: "support@reprecinct.com",
      },
    },
    servers: [
      {
        url:
          process.env.API_BASE_URL ||
          "https://pqjjudv6gn.ap-southeast-2.awsapprunner.com",
        description: "Production server",
      },
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Attribute: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the attribute",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            name: {
              type: "string",
              description: "Name of the attribute",
              example: "Color",
            },
          },
        },
        CreateAttributeRequest: {
          type: "object",
          required: ["attributes"],
          properties: {
            attributes: {
              oneOf: [
                {
                  type: "string",
                  description: "Single attribute name",
                  example: "Color",
                },
                {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Array of attribute names",
                  example: ["Color", "Size", "Brand"],
                },
              ],
            },
          },
        },
        CreateAttributeResponse: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                created: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of successfully created attributes",
                  example: ["Color", "Size"],
                },
                skipped: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "List of attributes that were skipped (already exist)",
                  example: ["Brand"],
                },
              },
            },
          },
        },
        AttributesListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Attribute",
              },
              description: "List of attributes",
            },
            total: {
              type: "number",
              description: "Total number of attributes",
              example: 10,
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "OK",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2025-06-15T10:30:00.000Z",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Error: invalid body format",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          summary: "Health check endpoint",
          description: "Returns the health status of the API",
          tags: ["Health"],
          responses: {
            200: {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/HealthResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/api/attribute": {
        get: {
          summary: "Get attributes with optional filtering",
          description:
            "Retrieve a list of attributes with optional search and limit parameters.",
          tags: ["Attributes"],
          parameters: [
            {
              in: "query",
              name: "limit",
              schema: {
                type: "integer",
                minimum: 0,
                default: 0,
              },
              description:
                "Maximum number of attributes to return (0 = no limit)",
              example: 10,
            },
            {
              in: "query",
              name: "search",
              schema: {
                type: "string",
              },
              description: "Search term to filter attributes by name",
              example: "color",
            },
          ],
          responses: {
            200: {
              description: "List of attributes retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AttributesListResponse",
                  },
                  example: {
                    data: [
                      {
                        id: "123e4567-e89b-12d3-a456-426614174000",
                        name: "Color",
                      },
                      {
                        id: "987fcdeb-51a2-43d1-9f12-123456789abc",
                        name: "Size",
                      },
                    ],
                    total: 2,
                  },
                },
              },
            },
            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
        post: {
          summary: "Create new attributes",
          description:
            "Create one or more attributes. Existing attributes will be skipped.",
          tags: ["Attributes"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateAttributeRequest",
                },
                examples: {
                  single: {
                    summary: "Create single attribute",
                    value: {
                      attributes: "Color",
                    },
                  },
                  multiple: {
                    summary: "Create multiple attributes",
                    value: {
                      attributes: ["Color", "Size", "Brand"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Attributes created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateAttributeResponse",
                  },
                  example: {
                    data: {
                      created: ["Color", "Size"],
                      skipped: ["Brand"],
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/BadRequest",
            },
            500: {
              $ref: "#/components/responses/InternalServerError",
            },
          },
        },
      },
    },
  },
  apis: [], // No longer need to scan files since we define paths directly
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Reprecinct API Documentation",
    })
  );

  // Serve swagger.json
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

export default specs;
