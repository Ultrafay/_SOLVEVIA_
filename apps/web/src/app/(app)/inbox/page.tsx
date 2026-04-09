"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowDown,
  FileText,
  Check,
  Clock,
  CircleSlash,
  AlertTriangle,
  Copy,
  X,
} from "lucide-react";
import {
  invoices,
  tabCounts,
  glCategories,
  type InvoiceRow,
  type InvoiceStatus,
} from "@/lib/mock-data";
import "./inbox.css";

/* ── Status badge config ── */
const badgeConfig: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  synced: { label: "Synced", className: "b-done" },
  review: { label: "Needs Review", className: "b-review" },
  processing: { label: "Processing", className: "b-proc" },
  duplicate: { label: "Blocked", className: "b-dup" },
  failed: { label: "Failed", className: "b-dup" },
};

/* ── Score color ── */
function scoreColor(score: number) {
  if (score >= 85) return "#15803D";
  if (score >= 60) return "#F59E0B";
  return "#DC2626";
}

/* ── Tabs ── */
type TabKey = "all" | "review" | "processing" | "synced" | "duplicates" | "failed";
const tabs: { key: TabKey; label: string; count: number; red?: boolean }[] = [
  { key: "all", label: "All", count: tabCounts.all },
  { key: "review", label: "Needs Review", count: tabCounts.review, red: true },
  { key: "processing", label: "Processing", count: tabCounts.processing },
  { key: "synced", label: "Synced", count: tabCounts.synced },
  { key: "duplicates", label: "Duplicates", count: tabCounts.duplicates, red: true },
  { key: "failed", label: "Failed", count: tabCounts.failed, red: true },
];

const tabFilter: Record<TabKey, (i: InvoiceRow) => boolean> = {
  all: () => true,
  review: (i) => i.status === "review",
  processing: (i) => i.status === "processing",
  synced: (i) => i.status === "synced",
  duplicates: (i) => i.status === "duplicate",
  failed: (i) => i.status === "failed",
};

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>("INV-2026-0340");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let list = invoices.filter(tabFilter[activeTab]);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.vendor.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.amount.includes(q)
      );
    }
    return list;
  }, [activeTab, searchQuery]);

  const selected = invoices.find((i) => i.id === selectedId) ?? null;

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setCheckedIds(new Set());
  }

  return (
    <>
      {/* Alert row */}
      <AlertRow />

      <div className="inbox-body">
        {/* Queue panel */}
        <div className="queue">
          {/* Batch bar */}
          {checkedIds.size > 0 && (
            <div className="batch-bar">
              <span className="batch-count">{checkedIds.size} selected</span>
              <button className="batch-btn">Approve All</button>
              <button className="batch-btn">Push to QBO</button>
              <button className="batch-btn">Mark Reviewed</button>
              <button className="batch-btn">Export</button>
              <span className="batch-close" onClick={clearSelection}>
                ✕ Clear
              </span>
            </div>
          )}

          {/* Search toolbar */}
          <div className="queue-toolbar">
            <div className="search-wrap">
              <Search size={13} strokeWidth={1.8} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search vendor, document ID, amount…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <SlidersHorizontal size={12} strokeWidth={1.8} />
              Filter
            </button>
            <button className="filter-btn">
              <ArrowDown size={12} strokeWidth={1.8} />
              Sort
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs-row">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`tab${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}{" "}
                <span className={`tab-count${tab.red ? " red" : ""}`}>
                  {tab.count}
                </span>
              </div>
            ))}
          </div>

          {/* Document list */}
          <div className="doc-list">
            {filtered.map((inv) => (
              <div
                key={inv.id}
                className={`doc-row${selectedId === inv.id ? " selected" : ""}`}
                onClick={() => setSelectedId(inv.id)}
              >
                <div
                  className={`row-check${checkedIds.has(inv.id) ? " checked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(inv.id);
                  }}
                />
                <div className="row-main">
                  <div className="row-top">
                    <span className="row-id">{inv.id}</span>
                    <span className="row-vendor">{inv.vendor}</span>
                    {inv.status === "duplicate" && (
                      <span className="dup-tag">DUPLICATE</span>
                    )}
                  </div>
                  <div className="row-meta">
                    <span className="row-amount">
                      {inv.currency} {inv.amount}
                    </span>
                    {inv.gl ? (
                      <>
                        <span className="row-gl auto">
                          &middot; {inv.ap || "Uncategorized"} &middot;
                        </span>
                        <span className="row-gl auto">{inv.gl}</span>
                      </>
                    ) : (
                      <>
                        <span className="row-gl uncategorized">
                          &middot; Uncategorized &middot;
                        </span>
                        <span className="row-gl">New vendor</span>
                      </>
                    )}
                    {inv.duplicateOf ? (
                      <span className="row-gl">
                        &middot; Same as {inv.duplicateOf}
                      </span>
                    ) : (
                      <span className="row-date">&middot; {inv.date}</span>
                    )}
                  </div>
                </div>
                <div className="row-right">
                  <span className={`badge ${badgeConfig[inv.status].className}`}>
                    {badgeConfig[inv.status].label}
                  </span>
                  <span className="score-pill">
                    <span className="score-mini">
                      <span
                        className="score-mini-fill"
                        style={{
                          width: `${inv.score}%`,
                          background: scoreColor(inv.score),
                        }}
                      />
                    </span>
                    {inv.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <DetailPanel invoice={selected} onClose={() => setSelectedId(null)} />
      </div>
    </>
  );
}

/* ── Alert Row component ── */
function AlertRow() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="alert-row">
      <div className="alert-item warn">
        <AlertTriangle size={13} strokeWidth={1.8} />
        <strong>3 low-confidence</strong> documents need manual review
      </div>
      <span className="alert-sep">&middot;</span>
      <div className="alert-item err">
        <Copy size={13} strokeWidth={1.8} />
        <strong>2 duplicate invoices</strong> detected and blocked
      </div>
      <span className="alert-sep">&middot;</span>
      <div className="alert-item err">
        <AlertTriangle size={13} strokeWidth={1.8} />
        <strong>2 QBO sync failures</strong> — action required
      </div>
      <span className="alert-dismiss" onClick={() => setVisible(false)}>
        Dismiss
      </span>
    </div>
  );
}

/* ── Detail Panel component ── */
function DetailPanel({
  invoice,
  onClose,
}: {
  invoice: InvoiceRow | null;
  onClose: () => void;
}) {
  if (!invoice) return <div style={{ width: 0, flexShrink: 0 }} />;

  const sc = scoreColor(invoice.score);
  const confidenceNote =
    invoice.score >= 85
      ? "Auto-approved — no review required"
      : invoice.score >= 60
        ? "Below 85% threshold — manual review required before QBO sync"
        : "Very low confidence — immediate review required";

  const qboLabel =
    invoice.qbo === "synced"
      ? "Synced to QBO"
      : invoice.qbo === "blocked"
        ? "Blocked – duplicate"
        : invoice.qbo === "failed"
          ? "Sync failed"
          : "Pending sync";
  const qboSub =
    invoice.qbo === "synced"
      ? "Successfully pushed to QuickBooks Online"
      : invoice.qbo === "blocked"
        ? "Resolve duplicate before pushing"
        : invoice.qbo === "failed"
          ? "Check QBO connection and retry"
          : "Will push to QBO after approval";
  const qboIconClass =
    invoice.qbo === "synced"
      ? ""
      : invoice.qbo === "failed" || invoice.qbo === "blocked"
        ? " failed"
        : " pending";

  return (
    <div className="detail open">
      {/* Header */}
      <div className="detail-header">
        <button className="detail-close" onClick={onClose}>
          <X size={13} strokeWidth={2} />
        </button>
        <div>
          <div className="detail-title">{invoice.vendor}</div>
          <div className="detail-id">{invoice.id}</div>
        </div>
        <div className="detail-actions">
          <button className="da-btn">Skip</button>
          <button className="da-btn primary">Approve →</button>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        {/* PDF thumbnail placeholder */}
        <div className="pdf-thumb">
          <FileText size={28} strokeWidth={1.2} />
          <div className="pdf-thumb-label">{invoice.id}.pdf</div>
          <div className="pdf-thumb-sub">Click to open full view</div>
        </div>

        {/* AI Confidence */}
        <div className="conf-block">
          <div className="conf-header">
            <span className="conf-label">AI Confidence Score</span>
            <span className="conf-score" style={{ color: sc }}>
              {invoice.score}%
            </span>
          </div>
          <div className="conf-bar-wrap">
            <div
              className="conf-bar"
              style={{ width: `${invoice.score}%`, background: sc }}
            />
          </div>
          <div className="conf-note">{confidenceNote}</div>
        </div>

        {/* Extracted fields */}
        <div className="field-group">
          <div className="field-group-title">Extracted Data</div>
          <FieldRow label="Vendor" value={invoice.vendor} />
          <FieldRow label="Amount" value={invoice.amount} />
          <FieldRow label="Currency" value={invoice.currency} />
          <FieldRow label="Invoice Date" value={invoice.date} />
          <FieldRow label="Invoice No." value={invoice.invoiceNo} />
        </div>

        {/* GL Categorization */}
        <div className="field-group">
          <div className="field-group-title">GL Categorization</div>
          <FieldRow label="AP Account" value={invoice.ap || ""} />
          <div className="field-row">
            <span className="field-label">GL Category</span>
            <select className="field-input" defaultValue={invoice.gl || ""}>
              <option value="">— Select category —</option>
              {glCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {!invoice.gl && (
            <div className="field-row">
              <span className="field-label">No rule</span>
              <span className="no-rule-tag">
                New vendor · no supplier rule matched
              </span>
            </div>
          )}
        </div>

        {/* QBO Status */}
        <div className="field-group">
          <div className="field-group-title">QBO Status</div>
          <div className="qbo-block">
            <div className={`qbo-icon${qboIconClass}`}>
              {invoice.qbo === "synced" ? (
                <Check size={16} strokeWidth={2} />
              ) : invoice.qbo === "blocked" || invoice.qbo === "failed" ? (
                <CircleSlash size={16} strokeWidth={2} />
              ) : (
                <Clock size={16} strokeWidth={2} />
              )}
            </div>
            <div>
              <div className="qbo-label">{qboLabel}</div>
              <div className="qbo-sub">{qboSub}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable field row ── */
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="field-row">
      <span className="field-label">{label}</span>
      <input className="field-input" defaultValue={value} />
    </div>
  );
}
