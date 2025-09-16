// Logic for handling tasks requests

const Task = require("../models/TaskModel");
const mongoose = require("mongoose"); // added mongoose import
const { protect } = require("../middleware/authMiddleware");

// READ: Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET: Fetch single task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params; // added

    // Find task
    const task = await Task.findById(id);

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view this task",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// CREATE: Add a new task
const createTask = async (req, res) => {
  try {
    const { title, description = "", completed = false } = req.body;

    const task = new Task({
      title,
      description,
      completed,
      user: req.user._id,
    });

    const newTask = await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      newTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// UPDATE: Edit an existing task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params; // added
    const updateFields = req.body; // added

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    Object.assign(task, updateFields);
    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message, // fixed
    });
  }
};

// DELETE: Remove a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // added

    // Remove task
    const deleteTask = await Task.findByIdAndDelete(id);

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    // Return success
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deleteTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
