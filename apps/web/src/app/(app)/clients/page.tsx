"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  AlertTriangle,
  X,
  RefreshCw,
  Link2,
} from "lucide-react";
import "./clients.css";

/* ── Types ── */
type ClientStatus = "active" | "inactive" | "attention";

interface Client {
  id: string;
  name: string;
  initials: string;
  color: string;
  country: string;
  qbo: "connected" | "disconnected";
  inbox: number;
  processing: number;
  postedThisMonth: number;
  lastActivity: string;
  status: ClientStatus;
  alert?: string;
  alertType?: "warn" | "error";
}

/* ── Mock data ── */
const clients: Client[] = [
  {
    id: "ath",
    name: "Athgadlang Trading LLC",
    initials: "AT",
    color: "a",
    country: "UAE — Dubai",
    qbo: "connected",
    inbox: 8,
    processing: 2,
    postedThisMonth: 34,
    lastActivity: "2 min ago",
    status: "active",
  },
  {
    id: "gulf-star",
    name: "Gulf Star Logistics",
    initials: "GS",
    color: "b",
    country: "UAE — Abu Dhabi",
    qbo: "connected",
    inbox: 3,
    processing: 1,
    postedThisMonth: 22,
    lastActivity: "15 min ago",
    status: "active",
  },
  {
    id: "riyadh-eng",
    name: "Riyadh Engineering Co.",
    initials: "RE",
    color: "c",
    country: "KSA — Riyadh",
    qbo: "connected",
    inbox: 12,
    processing: 4,
    postedThisMonth: 18,
    lastActivity: "1 hr ago",
    status: "attention",
    alert: "5 invoices pending review for 3+ days",
    alertType: "warn",
  },
  {
    id: "marina-prop",
    name: "Marina Properties Group",
    initials: "MP",
    color: "d",
    country: "UAE — Dubai",
    qbo: "disconnected",
    inbox: 0,
    processing: 0,
    postedThisMonth: 0,
    lastActivity: "3 days ago",
    status: "attention",
    alert: "QBO disconnected — re-authorize to resume sync",
    alertType: "error",
  },
  {
    id: "oasis-fmcg",
    name: "Oasis FMCG Distribution",
    initials: "OF",
    color: "e",
    country: "UAE — Sharjah",
    qbo: "connected",
    inbox: 1,
    processing: 0,
    postedThisMonth: 41,
    lastActivity: "30 min ago",
    status: "active",
  },
  {
    id: "jeddah-imp",
    name: "Jeddah Import House",
    initials: "JI",
    color: "f",
    country: "KSA — Jeddah",
    qbo: "connected",
    inbox: 6,
    processing: 3,
    postedThisMonth: 15,
    lastActivity: "4 hrs ago",
    status: "active",
  },
  {
    id: "pearl-marine",
    name: "Pearl Marine Services",
    initials: "PM",
    color: "g",
    country: "Qatar — Doha",
    qbo: "connected",
    inbox: 0,
    processing: 0,
    postedThisMonth: 9,
    lastActivity: "2 days ago",
    status: "inactive",
  },
  {
    id: "dubai-auto",
    name: "Dubai Auto Spare Parts",
    initials: "DA",
    color: "h",
    country: "UAE — Deira",
    qbo: "connected",
    inbox: 2,
    processing: 1,
    postedThisMonth: 27,
    lastActivity: "45 min ago",
    status: "active",
  },
];

/* ── Tabs ── */
type TabKey = "all" | "active" | "inactive" | "attention";

const tabFilter: Record<TabKey, (c: Client) => boolean> = {
  all: () => true,
  active: (c) => c.status === "active",
  inactive: (c) => c.status === "inactive",
  attention: (c) => c.status === "attention",
};

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const tabCounts = {
    all: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    inactive: clients.filter((c) => c.status === "inactive").length,
    attention: clients.filter((c) => c.status === "attention").length,
  };

  const tabs: { key: TabKey; label: string; count: number; warn?: boolean }[] = [
    { key: "all", label: "All Clients", count: tabCounts.all },
    { key: "active", label: "Active", count: tabCounts.active },
    { key: "inactive", label: "Inactive", count: tabCounts.inactive },
    { key: "attention", label: "Needs Attention", count: tabCounts.attention, warn: true },
  ];

  const filtered = useMemo(() => {
    let list = clients.filter(tabFilter[activeTab]);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search]);

  return (
    <div className="clients-page">
      {/* Toolbar */}
      <div className="clients-toolbar">
        <div className="clients-search-wrap">
          <Search size={13} strokeWidth={1.8} />
          <input
            className="clients-search"
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="clients-toolbar-spacer" />
        <button className="add-client-btn" onClick={() => setModalOpen(true)}>
          <Plus size={14} strokeWidth={2.5} />
          Add Client
        </button>
      </div>

      {/* Tabs */}
      <div className="clients-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`clients-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span
              className={`clients-tab-count${tab.warn && tab.count > 0 ? " warn" : ""}`}
            >
              {tab.count}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="clients-grid-wrap">
        <div className="clients-grid">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
          {filtered.length === 0 && (
            <div className="clients-empty">
              No clients match your search
            </div>
          )}
        </div>
      </div>

      {/* Add Client modal */}
      {modalOpen && <AddClientModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

/* ── Client Card ── */
function ClientCard({ client }: { client: Client }) {
  return (
    <div
      className={`client-card${client.status === "attention" ? " attention" : ""}`}
    >
      {/* Header */}
      <div className="cc-header">
        <div className={`cc-avatar ${client.color}`}>{client.initials}</div>
        <div className="cc-name-wrap">
          <div className="cc-name">{client.name}</div>
          <div className="cc-country">{client.country}</div>
        </div>
        <div className={`cc-qbo ${client.qbo}`}>
          <span className="cc-qbo-dot" />
          {client.qbo === "connected" ? "QBO" : "QBO off"}
        </div>
      </div>

      {/* Stats */}
      <div className="cc-stats">
        <div className="cc-stat">
          <div className="cc-stat-num">{client.inbox}</div>
          <div className="cc-stat-label">Inbox</div>
        </div>
        <div className="cc-stat">
          <div className="cc-stat-num">{client.processing}</div>
          <div className="cc-stat-label">Processing</div>
        </div>
        <div className="cc-stat">
          <div className="cc-stat-num">{client.postedThisMonth}</div>
          <div className="cc-stat-label">Posted</div>
        </div>
      </div>

      {/* Alert */}
      {client.alert && (
        <div className={`cc-alert${client.alertType === "error" ? " error" : ""}`}>
          <AlertTriangle size={13} strokeWidth={1.8} />
          {client.alert}
        </div>
      )}

      {/* Footer */}
      <div className="cc-footer">
        <span className="cc-last-activity">Last activity: {client.lastActivity}</span>
        <button className="cc-open-btn">Open →</button>
      </div>
    </div>
  );
}

/* ── Add Client Modal ── */
function AddClientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Add Client</span>
          <button className="modal-close" onClick={onClose}>
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">Client Name</label>
            <input className="modal-input" placeholder="e.g. Gulf Star Logistics" />
          </div>

          <div className="modal-field">
            <label className="modal-label">Country</label>
            <select className="modal-select" defaultValue="">
              <option value="" disabled>
                Select country…
              </option>
              <option value="UAE">UAE</option>
              <option value="KSA">KSA</option>
              <option value="Qatar">Qatar</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Oman">Oman</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">Trade License / CR Number</label>
            <input className="modal-input" placeholder="e.g. 123456" />
          </div>

          <div className="modal-field">
            <label className="modal-label">QuickBooks Online</label>
            <button className="modal-qbo-btn">
              <Link2 size={14} strokeWidth={1.7} />
              Connect QuickBooks Online
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-submit" onClick={onClose}>
            Create Client
          </button>
        </div>
      </div>
    </div>
  );
}
