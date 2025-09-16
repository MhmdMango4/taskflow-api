const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");

const rateLimit = require("express-rate-limit");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./src/swagger/swagger.yaml");

const config = require("./src/config/config");
const currentConfig = config[process.env.NODE_ENV || "development"];
const PORT = currentConfig;

const app = express();

// Enable CORS for all origins (restrict in production if needed)
app.use(cors({ origin: currentConfig.corsOrigin }));

// Rate limiting - 100 request per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: currentConfig.rateLimitMax,
  message: {
    success: false,
    message: "Too many request from this IP, please try again later",
  },
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware: Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware: Parse JSON
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const connectDB = require("./src/config/db");

app.use(express.json());

const taskRoutes = require("./src/routes/taskRoutes");

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskFlow API",
    version: "1.0.0",
    endpoint: {
      tasks: "GET, POST, PUT, DELETE /api/tasks",
    },
    documentation: "To be added soon!",
    author: "Mohammed Mango",
  });
});

// 🚫 404 Middleware — Catches unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    error: "NotFound",
  });
});

connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${PORT}`);
  console.log(`Access the welcome endpoint at http://localhost:${PORT}/`);
});
