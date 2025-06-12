import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger";
import {
  createAttributesApiHandler,
  filterAttributesApiHandler,
} from "./interfaces/attribute/AttributeInterfaces";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Swagger UI
  })
);

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Health check endpoint - must be defined before other routes that might import database
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/attribute:
 *   post:
 *     summary: Create new attributes
 *     description: Create one or more attributes. Existing attributes will be skipped.
 *     tags:
 *       - Attributes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttributeRequest'
 *           examples:
 *             single:
 *               summary: Create single attribute
 *               value:
 *                 attributes: "Color"
 *             multiple:
 *               summary: Create multiple attributes
 *               value:
 *                 attributes: ["Color", "Size", "Brand"]
 *     responses:
 *       200:
 *         description: Attributes created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAttributeResponse'
 *             example:
 *               data:
 *                 created: ["Color", "Size"]
 *                 skipped: ["Brand"]
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Lazy load attribute handlers to avoid Prisma initialization on health checks
app.post("/api/attribute", async (req, res) => {
  try {
    return createAttributesApiHandler(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/**
 * @swagger
 * /api/attribute:
 *   get:
 *     summary: Get attributes with optional filtering
 *     description: Retrieve a list of attributes with optional search and limit parameters.
 *     tags:
 *       - Attributes
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Maximum number of attributes to return (0 = no limit)
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter attributes by name
 *         example: "color"
 *     responses:
 *       200:
 *         description: List of attributes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttributesListResponse'
 *             example:
 *               data:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   name: "Color"
 *                 - id: "987fcdeb-51a2-43d1-9f12-123456789abc"
 *                   name: "Size"
 *               total: 2
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
app.get("/api/attribute", async (req, res) => {
  try {
    return filterAttributesApiHandler(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
