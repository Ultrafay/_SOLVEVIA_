export type InvoiceStatus =
  | "synced"
  | "review"
  | "processing"
  | "duplicate"
  | "failed";

export type QboStatus = "synced" | "pending" | "blocked" | "failed";

export interface InvoiceRow {
  id: string;
  vendor: string;
  amount: string;
  currency: string;
  date: string;
  gl: string;
  ap: string;
  score: number;
  status: InvoiceStatus;
  qbo: QboStatus;
  invoiceNo: string;
  duplicateOf?: string;
}

export const invoices: InvoiceRow[] = [
  {
    id: "INV-2026-0341",
    vendor: "Emirates NBD",
    amount: "12,450.00",
    currency: "AED",
    date: "19 Mar 2026",
    gl: "Bank Fees",
    ap: "Accounts Payable (A/P) – AED",
    score: 94,
    status: "synced",
    qbo: "synced",
    invoiceNo: "ENB-2026-440",
  },
  {
    id: "INV-2026-0340",
    vendor: "Dar Al Riyadh",
    amount: "8,200.00",
    currency: "AED",
    date: "18 Mar 2026",
    gl: "",
    ap: "Accounts Payable (A/P) – AED",
    score: 61,
    status: "review",
    qbo: "pending",
    invoiceNo: "DR-2026-0118",
  },
  {
    id: "INV-2026-0339",
    vendor: "DEWA",
    amount: "3,750.00",
    currency: "AED",
    date: "17 Mar 2026",
    gl: "Utilities",
    ap: "Accounts Payable (A/P) – AED",
    score: 97,
    status: "synced",
    qbo: "synced",
    invoiceNo: "DEWA-MAR-26",
  },
  {
    id: "INV-2026-0338",
    vendor: "Du Telecom",
    amount: "1,299.00",
    currency: "AED",
    date: "17 Mar 2026",
    gl: "Telephone",
    ap: "Accounts Payable (A/P) – AED",
    score: 91,
    status: "processing",
    qbo: "pending",
    invoiceNo: "DU-4412-2026",
  },
  {
    id: "INV-2026-0337",
    vendor: "Al Futtaim Group",
    amount: "27,800.00",
    currency: "AED",
    date: "16 Mar 2026",
    gl: "",
    ap: "",
    score: 45,
    status: "review",
    qbo: "pending",
    invoiceNo: "AFG-2026-0037",
  },
  {
    id: "INV-2026-0336",
    vendor: "Emirates NBD",
    amount: "12,450.00",
    currency: "AED",
    date: "16 Mar 2026",
    gl: "Bank Fees",
    ap: "",
    score: 94,
    status: "duplicate",
    qbo: "blocked",
    invoiceNo: "ENB-2026-440",
    duplicateOf: "INV-2026-0341",
  },
  {
    id: "INV-2026-0335",
    vendor: "Careem",
    amount: "540.00",
    currency: "AED",
    date: "15 Mar 2026",
    gl: "Travel",
    ap: "Accounts Payable (A/P) – AED",
    score: 88,
    status: "synced",
    qbo: "synced",
    invoiceNo: "CRM-20260315",
  },
  {
    id: "INV-2026-0334",
    vendor: "Noon.com",
    amount: "2,100.00",
    currency: "AED",
    date: "14 Mar 2026",
    gl: "Office Supplies",
    ap: "Accounts Payable (A/P) – AED",
    score: 79,
    status: "synced",
    qbo: "synced",
    invoiceNo: "NOON-2843",
  },
  {
    id: "INV-2026-0333",
    vendor: "Etisalat",
    amount: "899.00",
    currency: "AED",
    date: "13 Mar 2026",
    gl: "Telephone",
    ap: "Accounts Payable (A/P) – AED",
    score: 58,
    status: "review",
    qbo: "pending",
    invoiceNo: "ET-MAR-2026-99",
  },
  {
    id: "INV-2026-0332",
    vendor: "Aramex",
    amount: "4,320.00",
    currency: "AED",
    date: "12 Mar 2026",
    gl: "Shipping & Delivery",
    ap: "Accounts Payable (A/P) – AED",
    score: 92,
    status: "synced",
    qbo: "synced",
    invoiceNo: "ARX-2026-8812",
  },
  {
    id: "INV-2026-0331",
    vendor: "Emaar Properties",
    amount: "45,000.00",
    currency: "AED",
    date: "11 Mar 2026",
    gl: "Rent",
    ap: "Accounts Payable (A/P) – AED",
    score: 96,
    status: "synced",
    qbo: "synced",
    invoiceNo: "EMAAR-Q1-2026",
  },
  {
    id: "INV-2026-0330",
    vendor: "Fetchr",
    amount: "1,875.00",
    currency: "AED",
    date: "10 Mar 2026",
    gl: "Shipping & Delivery",
    ap: "Accounts Payable (A/P) – AED",
    score: 73,
    status: "processing",
    qbo: "pending",
    invoiceNo: "FTCHR-0330",
  },
  {
    id: "INV-2026-0329",
    vendor: "Al Futtaim Group",
    amount: "27,800.00",
    currency: "AED",
    date: "10 Mar 2026",
    gl: "Professional Services",
    ap: "",
    score: 91,
    status: "duplicate",
    qbo: "blocked",
    invoiceNo: "AFG-2026-0037",
    duplicateOf: "INV-2026-0337",
  },
  {
    id: "INV-2026-0328",
    vendor: "Chalhoub Group",
    amount: "6,750.00",
    currency: "AED",
    date: "9 Mar 2026",
    gl: "",
    ap: "",
    score: 38,
    status: "failed",
    qbo: "failed",
    invoiceNo: "CHG-ILLEGIBLE",
  },
  {
    id: "INV-2026-0327",
    vendor: "Salik",
    amount: "210.00",
    currency: "AED",
    date: "8 Mar 2026",
    gl: "Travel",
    ap: "Accounts Payable (A/P) – AED",
    score: 99,
    status: "synced",
    qbo: "synced",
    invoiceNo: "SALIK-MAR-2026",
  },
];

/* ── Pipeline summary counts ── */
export const pipelineCounts = {
  uploaded: invoices.length,
  extracted: invoices.filter((i) => i.status !== "failed").length,
  glMapped: invoices.filter((i) => i.gl !== "").length,
  needsReview: invoices.filter((i) => i.status === "review").length,
  synced: invoices.filter((i) => i.status === "synced").length,
};

/* ── Tab filter counts ── */
export const tabCounts = {
  all: invoices.length,
  review: invoices.filter((i) => i.status === "review").length,
  processing: invoices.filter((i) => i.status === "processing").length,
  synced: invoices.filter((i) => i.status === "synced").length,
  duplicates: invoices.filter((i) => i.status === "duplicate").length,
  failed: invoices.filter((i) => i.status === "failed").length,
};

export const glCategories = [
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
];
