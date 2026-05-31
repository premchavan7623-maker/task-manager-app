import React, { useState } from "react";

export default function TaskItem({ task, t, onToggle, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title || "");
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(task.due_date ? task.due_date.split('T')[0] : "");
  const [editPriority, setEditPriority] = useState(task.priority || "none");

  const startEdit = () => {
    setEditTitle(task.title || "");
    setEditDesc(task.description || "");
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : "");
    setEditPriority(task.priority || "none");
    setIsEditing(true);
  };

  const saveEdit = () => {
    onSave(task.id, {
      title: editTitle,
      description: editDesc,
      due_date: editDueDate || null,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "10px 8px",
        borderRadius: "4px",
        borderBottom: `1px solid ${t.border}22`,
        transition: "background 100ms",
        background: isHovered ? t.bgHover : "transparent",
      }}
    >
      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            style={{
              border: "none",
              borderBottom: `1px solid ${t.accent}`,
              background: "transparent",
              fontSize: "14px",
              fontWeight: "600",
              color: t.text,
              padding: "4px 0",
            }}
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            style={{
              border: "none",
              borderBottom: `1px solid ${t.border}`,
              background: "transparent",
              fontSize: "13px",
              color: t.textSec,
              fontFamily: "inherit",
              padding: "4px 0",
            }}
          />
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              style={{
                border: "none",
                background: t.tagBg,
                color: t.textSec,
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "11px",
                fontFamily: "inherit",
              }}
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              style={{
                border: "none",
                background: t.tagBg,
                color: t.textSec,
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "11px",
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
              onClick={saveEdit}
              style={{
                background: t.accent,
                color: "#fff",
                border: "none",
                padding: "3px 10px",
                borderRadius: "3px",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              style={{
                background: "none",
                border: `1px solid ${t.border}`,
                color: t.textSec,
                padding: "3px 10px",
                borderRadius: "3px",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flex: 1 }}>
            <button
              onClick={() => onToggle(task.id)}
              style={{
                marginTop: "3px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: `2px solid ${task.status === "completed" ? t.accent : "#d3d2d1"}`,
                background: task.status === "completed" ? t.accent : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                flexShrink: 0,
              }}
            >
              {task.status === "completed" && <span style={{ color: "#fff", fontSize: "9px", fontWeight: "900" }}>&#10003;</span>}
            </button>

            <div style={{ flex: 1, cursor: "pointer" }} onClick={startEdit}>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: t.text,
                  fontWeight: "500",
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                  opacity: task.status === "completed" ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {task.title}
                {task.priority && task.priority !== "none" && (
                  <span style={{ 
                    fontSize: "10px", 
                    padding: "2px 6px", 
                    borderRadius: "4px", 
                    background: task.priority === 'high' ? '#ffebeb' : task.priority === 'medium' ? '#fff6e5' : '#eaf9e8', 
                    color: task.priority === 'high' ? '#eb5757' : task.priority === 'medium' ? '#f2994a' : '#219653', 
                    fontWeight: "600",
                    textDecoration: "none"
                  }}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}
              </div>
              {task.description && (
                <div style={{ fontSize: "13px", color: t.textSec, marginTop: "2px", lineHeight: "1.4" }}>
                  {task.description}
                </div>
              )}
              {task.due_date && (
                <div style={{ fontSize: "12px", color: t.textMuted, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  {new Date(task.due_date).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "4px",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 100ms",
              pointerEvents: isHovered ? "auto" : "none",
            }}
          >
            <button
              onClick={startEdit}
              style={{
                background: "none",
                border: "none",
                color: t.textSec,
                fontSize: "12px",
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              style={{
                background: "none",
                border: "none",
                color: "#e03e3e",
                fontSize: "12px",
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: "3px",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
