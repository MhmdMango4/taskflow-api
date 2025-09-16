// __tests__/integration/task.test.js — Full CRUD API Tests

const request = require("supertest");
const app = require("../../server.test");
const Task = require("../../src/models/TaskModel");

describe("Task API", () => {
  beforeEach(async () => {
    // Clear database before each test
    await Task.deleteMany({});
  });

  // ✅ TEST: GET /api/tasks — should return empty array initially
  it("GET /api/tasks should return empty array when no tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  // ➕ TEST: POST /api/tasks — should create a new task
  it("POST /api/tasks should create a new task", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Test Task",
      description: "Test Description",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test Task");
    expect(res.body.data.completed).toBe(false);

    // Verify in DB
    const tasks = await Task.find();
    expect(tasks.length).toBe(1);
  });

  // 🚫 TEST: POST /api/tasks — should fail with invalid data
  it("POST /api/tasks should fail with empty title", async () => {
    const res = await request(app).post("/api/tasks").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe("title");
  });

  // 🔍 TEST: GET /api/tasks/:id — should return single task
  it("GET /api/tasks/:id should return a single task", async () => {
    const task = new Task({
      title: "Find Me",
      description: "I am here",
    });
    await task.save();

    const res = await request(app).get(`/api/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Find Me");
  });

  // 🚫 TEST: GET /api/tasks/:id — should fail with invalid ID
  it("GET /api/tasks/:id should fail with invalid ID", async () => {
    const res = await request(app).get("/api/tasks/invalidid");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation Error");
  });

  // ✏️ TEST: PUT /api/tasks/:id — should update a task
  it("PUT /api/tasks/:id should update a task", async () => {
    const task = new Task({ title: "Old Title" });
    await task.save();

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: "New Title", completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("New Title");
    expect(res.body.data.completed).toBe(true);
  });

  // ❌ TEST: DELETE /api/tasks/:id — should delete a task
  it("DELETE /api/tasks/:id should delete a task", async () => {
    const task = new Task({ title: "To be deleted" });
    await task.save();

    const res = await request(app).delete(`/api/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });

  // 🌐 TEST: GET / — should return welcome message
  it("GET / should return welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("TaskFlow API - Test Mode");
  });
});
