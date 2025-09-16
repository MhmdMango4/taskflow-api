// Define all task-related endpoints

const express = require("express");
const router = express.Router();

const {
  validateCreateTask,
  validateUpdateTask,
  handleValidationErrors,
} = require("../middleware/validateTask");

const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../controllers/taskControllers");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET    /api/tasks        → Get all tasks
router.get("/", getAllTasks);

// GET    /api/tasks/:id    → Get single task by ID
router.get("/:id", validateUpdateTask[0], handleValidationErrors, getTaskById);

// POST   /api/tasks        → Create new task
router.post("/", validateCreateTask, handleValidationErrors, createTask);

// PUT    /api/tasks/:id    → Update task by ID
router.put("/:id", validateUpdateTask, handleValidationErrors, updateTask);

// DELETE /api/tasks/:id    → Delete task by ID
router.delete(
  "/:id",
  validateUpdateTask[0],
  handleValidationErrors,
  deleteTask
);

module.exports = router;
