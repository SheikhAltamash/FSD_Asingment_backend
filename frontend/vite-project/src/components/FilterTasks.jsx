const FilterTasks = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="filter-buttons">
      <button
        onClick={() => onFilterChange("All")}
        disabled={currentFilter === "All"}
        className={currentFilter !== "All" ? "secondary" : ""}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange("Active")}
        disabled={currentFilter === "Active"}
        className={currentFilter !== "Active" ? "secondary" : ""}
      >
        Active
      </button>
      <button
        onClick={() => onFilterChange("Completed")}
        disabled={currentFilter === "Completed"}
        className={currentFilter !== "Completed" ? "secondary" : ""}
      >
        Completed
      </button>
    </div>
  );
};

export default FilterTasks;
