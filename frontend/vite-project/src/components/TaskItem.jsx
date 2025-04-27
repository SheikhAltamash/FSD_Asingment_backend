const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const TaskItem = ({ task, onToggleComplete, onDeleteTask }) => {
  const isCompleted = task.status === "Completed";

  return (
    <li className={`task-item ${isCompleted ? "completed" : ""}`}>
      <div className="task-details">
        <h4>{task.title}</h4>
        {task.description && <p>{task.description}</p>}
        <div className="meta">
          Priority: {task.priority} | Status: {task.status} | Created:{" "}
          {formatDate(task.createdAt)}
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={() => onToggleComplete(task._id, isCompleted)}
          className="secondary"
        >
          {isCompleted ? "Mark Active" : "Mark Complete"}
        </button>
        <button onClick={() => onDeleteTask(task._id)} className="danger">
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
