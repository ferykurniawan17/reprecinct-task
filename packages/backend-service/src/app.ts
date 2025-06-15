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

app.post("/api/attribute", async (req, res) => {
  try {
    return createAttributesApiHandler(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/api/attribute", async (req, res) => {
  try {
    return filterAttributesApiHandler(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
