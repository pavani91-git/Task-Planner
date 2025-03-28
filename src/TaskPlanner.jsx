import { useState } from "react";
import axios from "axios";
import "./styles/TaskPlanner.css"; // Ensure this CSS file exists

const TaskPlanner = () => {
  const [tasks, setTasks] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSchedule(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/api/plan", tasks, {
        headers: { "Content-Type": "text/plain" }, // Send tasks as raw text
      });

      setSchedule(response.data);
    } catch (err) {
      setError("Failed to generate schedule. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="planner-box">
        <h1>Daily Task Planner</h1>
        <p>Type your tasks here (comma-separated):</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="e.g., Run 20 mins, Mow lawn, Prep for meeting..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Planning..." : "Plan My Day"}
          </button>
        </form>

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {schedule && (
          <div className="schedule">
            <h2>Your Schedule</h2>
            <ul>
              {schedule.tasks.map((task, i) => (
                <li key={i}>
                  {task.time}: {task.task}
                </li>
              ))}
            </ul>
            <h3>Why This Way?</h3>
            <p>{schedule.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPlanner;
