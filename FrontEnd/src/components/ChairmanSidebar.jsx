// src/components/ChairmanSidebar.jsx
import React from "react";
import "./ChairmanSidebar.css";

export default function ChairmanSidebar({ activeTab, setActiveTab }) {
  const items = [
    { key: "profile", label: "Club Profile" },
    { key: "members", label: "Members" },
    { key: "posts", label: "Posts" },
    { key: "events", label: "Events" },
    { key: "stats", label: "Analytics" },
  ];

  return (
    <aside className="chairman-sidebar">
      <h2 className="chairman-title">Chairman Panel</h2>
      <nav>
        {items.map((item) => (
          <button
            key={item.key}
            className={activeTab === item.key ? "active" : ""}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
