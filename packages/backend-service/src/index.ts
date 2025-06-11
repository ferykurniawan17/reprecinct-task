import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import {
  createAttributesApiHandler,
  filterAttributesApiHandler,
} from "./interfaces/attribute/AttributeInterfaces";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// POST: /attribute
app.post("/api/attribute", (req, res) => createAttributesApiHandler(req, res));

// GET: /attribute
app.get("/api/attribute", (req, res) => filterAttributesApiHandler(req, res));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// parse port to number
const port = parseInt(process.env.PORT ?? "4000", 10);
app.listen(port, () => {
  console.log(`> Listening on http://localhost:${port}`);
});
