import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({
  t,
  currentUser,
  tasksLength,
  pendingCount,
  completedCount,
  activeFilter,
  setActiveFilter,
  darkMode,
  setDarkMode,
  handleLogout,
}) {
  return (
    <div
      style={{
        width: "240px",
        minWidth: "240px",
        background: t.bgSide,
        borderRight: `1px solid ${t.border}`,
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", marginBottom: "16px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "3px",
              background: t.text,
              color: t.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            {currentUser?.email?.charAt(0).toUpperCase()}
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: t.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentUser?.email?.split("@")[0]}'s Space
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            onClick={() => setActiveFilter("all")}
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              background: activeFilter === "all" ? t.tagBg : "transparent",
              fontSize: "14px",
              fontWeight: "500",
              color: activeFilter === "all" ? t.text : t.textSec,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>All Tasks</span>
            <span style={{ fontSize: "12px", color: t.textMuted }}>{tasksLength}</span>
          </div>
          <div
            onClick={() => setActiveFilter("pending")}
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              background: activeFilter === "pending" ? t.tagBg : "transparent",
              fontSize: "14px",
              color: activeFilter === "pending" ? t.text : t.textSec,
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <span>Pending</span>
            <span style={{ fontSize: "12px", color: t.textMuted }}>{pendingCount}</span>
          </div>
          <div
            onClick={() => setActiveFilter("completed")}
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              background: activeFilter === "completed" ? t.tagBg : "transparent",
              fontSize: "14px",
              color: activeFilter === "completed" ? t.text : t.textSec,
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <span>Completed</span>
            <span style={{ fontSize: "12px", color: t.textMuted }}>{completedCount}</span>
          </div>
          <Link
            to="/update-profile"
            style={{
              padding: "6px 8px",
              borderRadius: "4px",
              fontSize: "14px",
              color: t.textSec,
              textDecoration: "none",
              display: "block",
            }}
          >
            Settings
          </Link>
        </div>
      </div>

      <div style={{ padding: "0 4px" }}>
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 8px",
            borderRadius: "4px",
            fontSize: "13px",
            color: t.textSec,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>{darkMode ? "☼" : "☾"}</span>
          {darkMode ? "Light mode" : "Dark mode"}
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            textAlign: "left",
            padding: "6px 8px",
            borderRadius: "4px",
            color: t.textSec,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
