"use client";

import { Bell, Plus } from "lucide-react";
import { pipelineCounts } from "@/lib/mock-data";
import "./topbar.css";

const stages = [
  { label: "Uploaded", count: pipelineCounts.uploaded, color: "#3B82F6" },
  { label: "Extracted", count: pipelineCounts.extracted, color: "#8B5CF6" },
  { label: "GL Mapped", count: pipelineCounts.glMapped, color: "#DEA653" },
  {
    label: "Needs Review",
    count: pipelineCounts.needsReview,
    color: "#EF4444",
    countColor: "#DC2626",
  },
  {
    label: "QBO Synced",
    count: pipelineCounts.synced,
    color: "#15803D",
    countColor: "#15803D",
  },
];

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <span className="topbar-sep">&middot;</span>

      {/* Pipeline health strip */}
      <div className="pipeline-strip">
        {stages.map((stage, i) => (
          <div key={stage.label} className="ps-stage-wrap">
            {i > 0 && <span className="ps-arrow">&rsaquo;</span>}
            <div className="ps-stage">
              <div
                className="ps-dot"
                style={{ background: stage.color }}
              />
              <span className="ps-label">{stage.label}</span>
              <span
                className="ps-count"
                style={stage.countColor ? { color: stage.countColor } : undefined}
              >
                {stage.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right side */}
      <div className="topbar-right">
        <span className="org-pill">Athgadlang</span>
        <div className="notif-wrap">
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={14} strokeWidth={1.8} />
          </button>
          <div className="notif-dot" />
        </div>
        <button className="btn-upload">
          <Plus size={13} strokeWidth={2.5} />
          Upload
        </button>
      </div>
    </div>
  );
}
