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
        url: process.env.API_BASE_URL || "http://localhost:4000",
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
  },
  apis: ["./src/app.ts", "./src/interfaces/**/*.ts"], // Path to the API docs
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
