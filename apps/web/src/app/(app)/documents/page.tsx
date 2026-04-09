"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  File,
  Eye,
  RotateCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  allDocuments,
  allVendors,
  allGlAccounts,
  statusOptions,
  type DocStatus,
  type DocumentRow,
} from "@/lib/mock-documents";
import "./documents.css";

/* ── Saved views ── */
type SavedView = "all" | "this-month" | "last-quarter" | "unposted" | "by-supplier";
const savedViews: { key: SavedView; label: string }[] = [
  { key: "all", label: "All" },
  { key: "this-month", label: "This Month" },
  { key: "last-quarter", label: "Last Quarter" },
  { key: "unposted", label: "Unposted" },
  { key: "by-supplier", label: "By Supplier" },
];

/* ── Status badge labels ── */
const badgeLabels: Record<DocStatus, string> = {
  posted: "Posted",
  review: "Needs Review",
  processing: "Processing",
  duplicate: "Duplicate",
  failed: "Failed",
  archived: "Archived",
  voided: "Voided",
};

/* ── Sortable columns ── */
type SortKey = "id" | "vendor" | "amount" | "currency" | "gl" | "date" | "status" | "posted";
type SortDir = "asc" | "desc";

const columnDefs: { key: SortKey; label: string; className?: string }[] = [
  { key: "id", label: "Invoice ID" },
  { key: "vendor", label: "Vendor" },
  { key: "amount", label: "Amount" },
  { key: "currency", label: "Curr" },
  { key: "gl", label: "GL Account" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "posted", label: "Posted Date" },
];

function sortRows(rows: DocumentRow[], key: SortKey, dir: SortDir): DocumentRow[] {
  const mult = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    switch (key) {
      case "amount":
        return (a.amountNum - b.amountNum) * mult;
      case "vendor":
      case "currency":
      case "gl":
      case "status":
        return a[key].localeCompare(b[key]) * mult;
      case "id":
        return a.id.localeCompare(b.id) * mult;
      case "date":
      case "posted": {
        const field = key === "posted" ? "postedDate" : "date";
        if (a[field] === "—") return 1;
        if (b[field] === "—") return -1;
        return a[field].localeCompare(b[field]) * mult;
      }
      default:
        return 0;
    }
  });
}

/* ── Saved view filters ── */
function applyView(rows: DocumentRow[], view: SavedView): DocumentRow[] {
  switch (view) {
    case "this-month":
      return rows.filter((r) => r.date.includes("Apr"));
    case "last-quarter":
      return rows.filter(
        (r) => r.date.includes("Jan") || r.date.includes("Feb") || r.date.includes("Mar")
      );
    case "unposted":
      return rows.filter(
        (r) => r.status !== "posted" && r.status !== "archived"
      );
    case "by-supplier":
      return [...rows].sort((a, b) => a.vendor.localeCompare(b.vendor));
    default:
      return rows;
  }
}

export default function DocumentsPage() {
  const [view, setView] = useState<SavedView>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [glFilter, setGlFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [showExport, setShowExport] = useState(false);

  /* Filter + sort pipeline */
  const filtered = useMemo(() => {
    let rows = applyView(allDocuments, view);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.vendor.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.amount.includes(q)
      );
    }

    if (statusFilter !== "all") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (vendorFilter !== "all") {
      rows = rows.filter((r) => r.vendor === vendorFilter);
    }
    if (glFilter !== "all") {
      rows = rows.filter((r) => r.gl === glFilter);
    }

    if (view !== "by-supplier") {
      rows = sortRows(rows, sortKey, sortDir);
    }

    return rows;
  }, [view, search, statusFilter, vendorFilter, glFilter, sortKey, sortDir]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const sliced = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const startIdx = (safePage - 1) * perPage + 1;
  const endIdx = Math.min(safePage * perPage, filtered.length);

  /* Column sort toggle */
  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  /* Selection */
  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    const pageIds = sliced.map((r) => r.id);
    const allChecked = pageIds.every((id) => checkedIds.has(id));
    setCheckedIds((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => (allChecked ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  const pageIds = sliced.map((r) => r.id);
  const allOnPageChecked = pageIds.length > 0 && pageIds.every((id) => checkedIds.has(id));
  const someOnPageChecked = pageIds.some((id) => checkedIds.has(id));

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setVendorFilter("all");
    setGlFilter("all");
    setView("all");
    setPage(1);
  }

  const hasFilters =
    search || statusFilter !== "all" || vendorFilter !== "all" || glFilter !== "all" || view !== "all";

  /* Page buttons */
  const pageButtons: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
      pageButtons.push(i);
    } else if (pageButtons[pageButtons.length - 1] !== "...") {
      pageButtons.push("...");
    }
  }

  return (
    <div className="docs-page">
      {/* Toolbar */}
      <div className="docs-toolbar">
        <div className="docs-search-wrap">
          <Search size={13} strokeWidth={1.8} />
          <input
            className="docs-search"
            type="text"
            placeholder="Search ID, vendor, amount…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="saved-views">
          {savedViews.map((sv) => (
            <button
              key={sv.key}
              className={`sv-btn${view === sv.key ? " active" : ""}`}
              onClick={() => {
                setView(sv.key);
                setPage(1);
              }}
            >
              {sv.label}
            </button>
          ))}
        </div>

        <div className="toolbar-spacer" />

        <div style={{ position: "relative" }}>
          <button
            className="export-btn"
            onClick={() => setShowExport((v) => !v)}
          >
            <Download size={13} strokeWidth={1.8} />
            Export
          </button>
          {showExport && (
            <div className="export-dropdown">
              <div className="export-opt" onClick={() => setShowExport(false)}>
                <FileSpreadsheet size={13} strokeWidth={1.7} />
                CSV
              </div>
              <div className="export-opt" onClick={() => setShowExport(false)}>
                <FileSpreadsheet size={13} strokeWidth={1.7} />
                Excel
              </div>
              <div className="export-opt" onClick={() => setShowExport(false)}>
                <FileText size={13} strokeWidth={1.7} />
                PDF
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Status</span>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <span className="filter-sep">|</span>

        <div className="filter-group">
          <span className="filter-label">Vendor</span>
          <select
            className="filter-select"
            value={vendorFilter}
            onChange={(e) => {
              setVendorFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All vendors</option>
            {allVendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <span className="filter-sep">|</span>

        <div className="filter-group">
          <span className="filter-label">GL</span>
          <select
            className="filter-select"
            value={glFilter}
            onChange={(e) => {
              setGlFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All accounts</option>
            {allGlAccounts.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <span className="clear-filters" onClick={clearFilters}>
            Clear all
          </span>
        )}
      </div>

      {/* Batch bar */}
      {checkedIds.size > 0 && (
        <div className="docs-batch">
          <span className="docs-batch-count">{checkedIds.size} selected</span>
          <button className="docs-batch-btn">Approve</button>
          <button className="docs-batch-btn">Push to QBO</button>
          <button className="docs-batch-btn">Archive</button>
          <button className="docs-batch-btn">Export</button>
          <span
            className="docs-batch-close"
            onClick={() => setCheckedIds(new Set())}
          >
            ✕ Clear
          </span>
        </div>
      )}

      {/* Table */}
      <div className="docs-table-wrap">
        <table className="docs-table">
          <thead>
            <tr>
              <th>
                <span
                  className={`tbl-check${allOnPageChecked ? " checked" : someOnPageChecked ? " partial" : ""}`}
                  onClick={toggleAll}
                />
              </th>
              {columnDefs.map((col) => (
                <th
                  key={col.key}
                  className={sortKey === col.key ? "sorted" : ""}
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  <span className="sort-arrow">
                    {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "▽"}
                  </span>
                </th>
              ))}
              <th style={{ cursor: "default" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliced.map((doc) => (
              <tr
                key={doc.id}
                className={checkedIds.has(doc.id) ? "selected" : ""}
              >
                <td>
                  <span
                    className={`tbl-check${checkedIds.has(doc.id) ? " checked" : ""}`}
                    onClick={() => toggleCheck(doc.id)}
                  />
                </td>
                <td className="cell-id">{doc.id}</td>
                <td className="cell-vendor">{doc.vendor}</td>
                <td className="cell-amount">{doc.amount}</td>
                <td className="cell-currency">{doc.currency}</td>
                <td className={`cell-gl${!doc.gl ? " empty" : ""}`}>
                  {doc.gl || "Unmapped"}
                </td>
                <td className="cell-date">{doc.date}</td>
                <td>
                  <span className={`doc-badge ${doc.status}`}>
                    {badgeLabels[doc.status]}
                  </span>
                </td>
                <td className="cell-posted">{doc.postedDate}</td>
                <td>
                  <div className="cell-actions">
                    <button className="act-btn" title="View">
                      <Eye size={13} strokeWidth={1.7} />
                    </button>
                    <button className="act-btn" title="Re-process">
                      <RotateCw size={13} strokeWidth={1.7} />
                    </button>
                    <button className="act-btn" title="Delete">
                      <Trash2 size={13} strokeWidth={1.7} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sliced.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "32px", color: "var(--t3)" }}>
                  No documents match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="docs-pagination">
        <span className="pag-info">
          Showing <strong>{filtered.length > 0 ? startIdx : 0}–{endIdx}</strong> of{" "}
          <strong>{filtered.length}</strong> documents
        </span>

        <div className="pag-spacer" />

        <div className="pag-per-page">
          <span>Per page</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="pag-btns">
          <button
            className="pag-btn"
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          {pageButtons.map((p, i) =>
            p === "..." ? (
              <button key={`e${i}`} className="pag-btn" disabled>
                …
              </button>
            ) : (
              <button
                key={p}
                className={`pag-btn${safePage === p ? " active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            className="pag-btn"
            disabled={safePage >= totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
