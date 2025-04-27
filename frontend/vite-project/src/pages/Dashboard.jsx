import  { useState, useEffect, useCallback } from "react";
import * as api from "../api";
import useAuth from "../hooks/useAuth";
import TaskList from "../components/TaskList";
import AddTaskForm from "../components/AddTaskForm";
import FilterTasks from "../components/FilterTasks";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const { user, logout } = useAuth(); 

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.fetchTasks();
      if (data.success) {
        setTasks(data.data);
      } else {
        setError(data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
      const message =
        err.response?.data?.message ||
        "An error occurred while fetching tasks.";
      setError(message);
      if (err.response?.status === 401) {
        logout(); 
      }
    } finally {
      setLoading(false);
    }
  }, [logout]); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); 

  const handleAddTask = async (newTaskData) => {
    setError(null); 
    try {
      const { data } = await api.createTask(newTaskData);
      if (data.success) {
        setTasks((prevTasks) => [data.data, ...prevTasks]);
      } else {
        setError(data.message || "Failed to add task");
      }
    } catch (err) {
      console.error("Add Task Error:", err);
      const message =
        err.response?.data?.message ||
        "An error occurred while adding the task.";
      setError(message);
    }
  };

  const handleToggleComplete = async (id, isCurrentlyCompleted) => {
    setError(null);
    const newStatus = isCurrentlyCompleted ? "Active" : "Completed";
    try {
      const { data } = await api.updateTask(id, { status: newStatus });
      if (data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        setError(data.message || "Failed to update task status");
      }
    } catch (err) {
      console.error("Toggle Complete Error:", err);
      const message =
        err.response?.data?.message ||
        "An error occurred while updating task status.";
      setError(message);
    }
  };

  const handleDeleteTask = async (id) => {
    setError(null);
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const { data } = await api.deleteTask(id);
      if (data.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      } else {
        setError(data.message || "Failed to delete task");
      }
    } catch (err) {
      console.error("Delete Task Error:", err);
      const message =
        err.response?.data?.message ||
        "An error occurred while deleting the task.";
      setError(message);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="container">
      <button onClick={logout} className="logout-button secondary">
        Logout
      </button>
      <h1>Task Management</h1>
      {user && <p>Welcome, {user.email}!</p>}

      <AddTaskForm onAddTask={handleAddTask} />

      <h2>Your Tasks</h2>
      <FilterTasks currentFilter={filter} onFilterChange={handleFilterChange} />

      {loading && <p>Loading tasks...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={tasks}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
