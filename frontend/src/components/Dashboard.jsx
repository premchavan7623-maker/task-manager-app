import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./app.css";
import Sidebar from "./Sidebar";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

const LIGHT = {
  bg: "#ffffff", bgSide: "#f7f7f5", bgHover: "#f1f1ef", bgForm: "#fbfbfa",
  text: "#37352f", textSec: "#7c7b77", textMuted: "#a4a3a0",
  border: "#ededeb", accent: "#2383e2", tagBg: "#efefed",
};
const DARK = {
  bg: "#191919", bgSide: "#1e1e1e", bgHover: "#2a2a2a", bgForm: "#202020",
  text: "#e0e0e0", textSec: "#9b9b9b", textMuted: "#666",
  border: "#2d2d2d", accent: "#2383e2", tagBg: "#2d2d2d",
};

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const t = darkMode ? DARK : LIGHT;
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { localStorage.setItem("darkMode", darkMode); }, [darkMode]);

  const fetchTasks = async () => {
    if (!currentUser?.email) return;
    try {
      setLoadingTasks(true);
      const res = await fetch(`http://localhost:5000/tasks/${currentUser.email}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks.");
    } finally { setLoadingTasks(false); }
  };

  useEffect(() => { if (currentUser) fetchTasks(); }, [currentUser]);

  const handleAdd = async ({ title, description, due_date, priority }) => {
    try {
      setSyncStatus("Saving...");
      const res = await fetch("http://localhost:5000/add-task", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, due_date, priority, user_email: currentUser.email }),
      });
      if (res.ok) { fetchTasks(); setSyncStatus("Synced"); }
    } catch (err) { console.error(err); setSyncStatus("Error"); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/toggle-task/${id}`, { method: "PUT" });
      if (res.ok) fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`http://localhost:5000/delete-task/${id}`, { method: "DELETE" });
      if (res.ok) fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/edit-task/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) fetchTasks();
    } catch (err) { console.error(err); }
  };

  async function handleLogout() {
    try { await logout(); navigate("/login"); }
    catch { setError("Failed to log out"); }
  }

  const pendingCount = tasks.filter(x => x.status === "pending").length;
  const completedCount = tasks.filter(x => x.status === "completed").length;

  const filtered = tasks.filter((task) => {
    return activeFilter === "all" || task?.status === activeFilter;
  });

  const filterBtn = (val) => ({
    padding: "4px 12px", borderRadius: "4px", fontSize: "13px", fontWeight: "500", cursor: "pointer",
    border: "none", background: activeFilter === val ? t.accent : t.tagBg, color: activeFilter === val ? "#fff" : t.textSec,
  });

  return (
    <div style={{ display: "flex", width: "100vw", minHeight: "100vh", background: t.bg, color: t.text, margin: 0, padding: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <Sidebar
        t={t}
        currentUser={currentUser}
        tasksLength={tasks.length}
        pendingCount={pendingCount}
        completedCount={completedCount}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleLogout={handleLogout}
      />

      <div style={{ flex: 1, padding: "48px 72px", overflowY: "auto" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", margin: "0 0 24px 0", letterSpacing: "-0.5px", color: t.text, display: "flex", alignItems: "center", gap: "12px" }}>
            Workspace Tracker
            {syncStatus !== "Synced" && <span style={{ fontSize: "16px", fontWeight: "normal", color: t.textMuted }}>({syncStatus})</span>}
          </h1>

          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            <button onClick={() => setActiveFilter("all")} style={filterBtn("all")}>All ({tasks.length})</button>
            <button onClick={() => setActiveFilter("pending")} style={filterBtn("pending")}>Pending ({pendingCount})</button>
            <button onClick={() => setActiveFilter("completed")} style={filterBtn("completed")}>Done ({completedCount})</button>
          </div>



          <TaskForm t={t} onAdd={handleAdd} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {error && <p style={{ color: "#eb5757", fontSize: "13px" }}>{error}</p>}
            {loadingTasks ? (
              <p style={{ color: t.textMuted, fontSize: "14px" }}>Loading tasks...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: t.textMuted, fontSize: "14px", fontStyle: "italic", borderTop: `1px solid ${t.border}`, paddingTop: "16px" }}>
                {activeFilter !== "all" ? "No matching tasks found." : "No tasks yet. Add one above to get started."}
              </p>
            ) : (
              filtered.map((task) => {
                if (!task?.id) return null;
                return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    t={t}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onSave={handleSaveEdit}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
