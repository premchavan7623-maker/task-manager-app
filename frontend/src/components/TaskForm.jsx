import React, { useState } from "react";

export default function TaskForm({ t, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("none");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      priority,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("none");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "36px",
        background: t.bgForm,
        border: `1px solid ${t.border}`,
        borderRadius: "6px",
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: "15px",
            fontWeight: "600",
            color: t.text,
          }}
        />
      </div>
      <textarea
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          fontSize: "13px",
          color: t.textSec,
          marginBottom: "8px",
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            border: "none",
            background: t.tagBg,
            color: t.textSec,
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            border: "none",
            background: t.tagBg,
            color: t.textSec,
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <option value="none">No Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div style={{ flex: 1 }} />
        <button
          type="submit"
          style={{
            background: t.accent,
            color: "#fff",
            border: "none",
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Add task
        </button>
      </div>
    </form>
  );
}
