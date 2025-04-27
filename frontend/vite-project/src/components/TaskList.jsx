import TaskItem from "./TaskItem";

const TaskList = ({ tasks, filter, onToggleComplete, onDeleteTask }) => {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Active") return task.status === "Active";
    if (filter === "Completed") return task.status === "Completed";
    return true; // Should not happen, but default to showing all
  });

  if (tasks.length === 0) {
    return <p>No tasks yet. Add one above!</p>;
  }

  if (filteredTasks.length === 0) {
    return <p>No tasks match the current filter '{filter}'.</p>;
  }

  return (
    <ul>
      {filteredTasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
