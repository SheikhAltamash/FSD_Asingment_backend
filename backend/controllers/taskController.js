const Task = require("../models/Task");

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Sort by newest first
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching tasks" });
  }
};

// @desc    Add a new task
// @route   POST /api/tasks
// @access  Private
exports.addTask = async (req, res) => {
  const { title, description, priority, status } = req.body; // Allow setting status on creation

  try {
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      status: status || "Active", // Default to Active if not provided
      user: req.user.id, // Associate task with the logged-in user
    });

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    console.error("Add Task Error:", error);
    // Handle potential validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error adding task" });
  }
};

// @desc    Update a task (e.g., mark as complete, change priority)
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  const { title, description, status, priority } = req.body;
  const taskId = req.params.id;

  try {
    let task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ensure the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to update this task",
        });
    }

    // Prepare update object - only include fields that are present in req.body
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status; // Allows changing status
    if (priority !== undefined) updateData.priority = priority;

    // Find and update the task
    task = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Update Task Error:", error);
    // Handle potential validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error updating task" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ensure the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to delete this task",
        });
    }

    await task.deleteOne(); // Mongoose v6+ uses deleteOne() on the document

    res
      .status(200)
      .json({ success: true, message: "Task removed successfully", data: {} }); // data: {} is common practice for deletes
  } catch (error) {
    console.error("Delete Task Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting task" });
  }
};
