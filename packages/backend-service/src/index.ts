import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
  createAttributesApiHandler,
  filterAttributesApiHandler,
} from "./interfaces/attribute/AttributeInterfaces";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// POST: /attribute
app.post("/attribute", (req, res) => createAttributesApiHandler(req, res));

// GET: /attribute
app.get("/attribute", (req, res) => filterAttributesApiHandler(req, res));

// parse port to number
const port = parseInt(process.env.PORT ?? "4000", 10);
app.listen(port, () => {
  console.log(`> Listening on http://localhost:${port}`);
});
