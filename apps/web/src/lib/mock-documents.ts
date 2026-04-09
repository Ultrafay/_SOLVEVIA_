/* ── All Documents mock data (50+ rows) ── */

export type DocStatus =
  | "posted"
  | "review"
  | "processing"
  | "duplicate"
  | "failed"
  | "archived"
  | "voided";

export interface DocumentRow {
  id: string;
  vendor: string;
  amount: string;
  amountNum: number;
  currency: string;
  gl: string;
  date: string;
  status: DocStatus;
  postedDate: string;
}

const vendors = [
  "Emirates NBD",
  "DEWA",
  "Du Telecom",
  "Etisalat",
  "Careem",
  "Noon.com",
  "Aramex",
  "Emaar Properties",
  "Fetchr",
  "Al Futtaim Group",
  "Chalhoub Group",
  "Salik",
  "Dar Al Riyadh",
  "Majid Al Futtaim",
  "DP World",
  "Aldar Properties",
  "Abu Dhabi Ports",
  "Mashreq Bank",
  "RAK Ceramics",
  "Gulf News",
  "Jumeirah Group",
  "Damac Properties",
  "Nakheel",
  "Al Tayer Group",
  "Dulsco",
  "Transguard",
  "Serco Middle East",
  "Khansaheb",
  "Drake & Scull",
  "Galadari Brothers",
];

const glAccounts = [
  "Bank Fees",
  "Utilities",
  "Telephone",
  "Travel",
  "Office Supplies",
  "Professional Services",
  "Rent",
  "Shipping & Delivery",
  "Insurance",
  "Marketing",
  "Fuel & Transport",
  "IT & Software",
  "Cleaning & Maintenance",
  "Printing & Stationery",
  "Entertainment",
];

const statuses: DocStatus[] = [
  "posted",
  "posted",
  "posted",
  "posted",
  "posted",
  "review",
  "processing",
  "duplicate",
  "failed",
  "archived",
  "archived",
  "voided",
];

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function randomDate(startMonth: number, endMonth: number): string {
  const month = startMonth + Math.floor(Math.random() * (endMonth - startMonth + 1));
  const day = 1 + Math.floor(Math.random() * 28);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${day} ${months[month - 1]} 2026`;
}

function randomPostedDate(status: DocStatus, docDate: string): string {
  if (status !== "posted" && status !== "archived") return "—";
  // Posted 1-3 days after doc date
  const parts = docDate.split(" ");
  const day = parseInt(parts[0]) + 1 + Math.floor(Math.random() * 3);
  return `${Math.min(day, 28)} ${parts[1]} ${parts[2]}`;
}

const rows: DocumentRow[] = [];

for (let i = 0; i < 54; i++) {
  const status = statuses[i % statuses.length];
  const amountNum = Math.round((200 + Math.random() * 49800) * 100) / 100;
  const date = randomDate(1, 4);
  const gl =
    status === "failed"
      ? ""
      : glAccounts[Math.floor(Math.random() * glAccounts.length)];

  rows.push({
    id: `INV-2026-${String(1000 + i).padStart(4, "0")}`,
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    amount: fmt(amountNum),
    amountNum,
    currency: Math.random() > 0.12 ? "AED" : Math.random() > 0.5 ? "USD" : "SAR",
    gl,
    date,
    status,
    postedDate: randomPostedDate(status, date),
  });
}

// Sort by date descending (approximate — newest first)
rows.sort((a, b) => {
  const months: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };
  const [dA, mA] = a.date.split(" ");
  const [dB, mB] = b.date.split(" ");
  const diff = months[mB] - months[mA];
  return diff !== 0 ? diff : parseInt(dB) - parseInt(dA);
});

export const allDocuments = rows;

export const allVendors = [...new Set(rows.map((r) => r.vendor))].sort();
export const allGlAccounts = [...new Set(rows.map((r) => r.gl).filter(Boolean))].sort();

export const statusOptions: { value: DocStatus; label: string }[] = [
  { value: "posted", label: "Posted" },
  { value: "review", label: "Needs Review" },
  { value: "processing", label: "Processing" },
  { value: "duplicate", label: "Duplicate" },
  { value: "failed", label: "Failed" },
  { value: "archived", label: "Archived" },
  { value: "voided", label: "Voided" },
];
