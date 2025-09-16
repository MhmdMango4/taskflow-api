// server.test.js — Server setup for testing (uses in-memory MongoDB)

const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const taskRoutes = require("./src/routes/taskRoutes");

// Create Express app
const app = express();
app.use(express.json());

// Mount routes
app.use("/api/tasks", taskRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "TaskFlow API - Test Mode" });
});

// Start server without listening (Supertest will handle requests)
module.exports = app;

// Setup and teardown MongoDB for tests
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
