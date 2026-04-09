"use client";

import { useState } from "react";
import {
  Upload,
  Mail,
  HardDrive,
  Smartphone,
  CloudUpload,
  FileText,
  Image,
  Copy,
  Check,
  QrCode,
  FolderOpen,
  Camera,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react";
import "./upload.css";

/* ── Source tabs ── */
type SourceTab = "drop" | "email" | "drive" | "mobile";
const sourceTabs: { key: SourceTab; label: string; icon: typeof Upload }[] = [
  { key: "drop", label: "Drag & Drop", icon: Upload },
  { key: "email", label: "Email Forwarding", icon: Mail },
  { key: "drive", label: "Google Drive", icon: HardDrive },
  { key: "mobile", label: "Mobile Capture", icon: Smartphone },
];

/* ── Mock uploaded files ── */
type UploadFileStatus = "uploading" | "extracting" | "ready" | "failed";

interface UploadFile {
  name: string;
  size: string;
  type: "pdf" | "img";
  status: UploadFileStatus;
  progress: number;
  date: string;
}

const mockFiles: UploadFile[] = [
  {
    name: "DEWA-April-2026.pdf",
    size: "1.2 MB",
    type: "pdf",
    status: "uploading",
    progress: 67,
    date: "Just now",
  },
  {
    name: "Du-Telecom-Q1.pdf",
    size: "845 KB",
    type: "pdf",
    status: "extracting",
    progress: 100,
    date: "2 min ago",
  },
  {
    name: "Emirates-NBD-Mar.pdf",
    size: "2.1 MB",
    type: "pdf",
    status: "ready",
    progress: 100,
    date: "5 min ago",
  },
  {
    name: "Office-Receipt-0412.jpg",
    size: "3.4 MB",
    type: "img",
    status: "ready",
    progress: 100,
    date: "12 min ago",
  },
  {
    name: "Careem-Ride-Receipts.pdf",
    size: "520 KB",
    type: "pdf",
    status: "ready",
    progress: 100,
    date: "18 min ago",
  },
  {
    name: "Noon-PO-Scan.heic",
    size: "4.8 MB",
    type: "img",
    status: "failed",
    progress: 100,
    date: "25 min ago",
  },
];

const statusLabel: Record<UploadFileStatus, string> = {
  uploading: "Uploading",
  extracting: "Extracting",
  ready: "Ready for Review",
  failed: "Failed",
};

/* ── Format tags ── */
const formats = ["PDF", "JPG", "PNG", "HEIC"];

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<SourceTab>("drop");
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {/* Source tabs */}
      <div className="upload-tabs">
        {sourceTabs.map((tab) => (
          <div
            key={tab.key}
            className={`upload-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={14} strokeWidth={1.7} />
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="upload-content">
        {activeTab === "drop" && (
          <DropTab
            dragOver={dragOver}
            setDragOver={setDragOver}
          />
        )}
        {activeTab === "email" && (
          <EmailTab copied={copied} onCopy={handleCopy} />
        )}
        {activeTab === "drive" && <DriveTab />}
        {activeTab === "mobile" && (
          <MobileTab copied={copied} onCopy={handleCopy} />
        )}
      </div>
    </>
  );
}

/* ── Drag & Drop tab ── */
function DropTab({
  dragOver,
  setDragOver,
}: {
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
}) {
  return (
    <>
      {/* Drop zone */}
      <div
        className={`drop-zone${dragOver ? " drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
      >
        <div className="drop-zone-icon">
          <CloudUpload size={24} strokeWidth={1.5} />
        </div>
        <div className="drop-zone-title">
          Drag files here or <span>browse</span>
        </div>
        <div className="drop-zone-sub">
          Upload invoices, receipts, and bills for AI extraction
        </div>
        <div className="drop-zone-formats">
          {formats.map((f) => (
            <span key={f} className="format-tag">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Recent uploads */}
      <div className="upload-queue">
        <div className="upload-queue-header">
          <span className="upload-queue-title">Recent Uploads</span>
          <span className="upload-queue-count">
            {mockFiles.length} files today
          </span>
        </div>

        {mockFiles.map((file) => (
          <div key={file.name} className="upload-file">
            <div className={`upload-file-icon ${file.type}`}>
              {file.type === "pdf" ? (
                <FileText size={16} strokeWidth={1.7} />
              ) : (
                <Image size={16} strokeWidth={1.7} />
              )}
            </div>
            <div className="upload-file-info">
              <div className="upload-file-name">{file.name}</div>
              <div className="upload-file-meta">
                <span>{file.size}</span>
                <span>&middot;</span>
                <span>{file.date}</span>
              </div>
            </div>

            {file.status === "uploading" ? (
              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-fill uploading"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                <div className="progress-label">{file.progress}%</div>
              </div>
            ) : file.status === "extracting" ? (
              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-fill extracting"
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="progress-label">Extracting…</div>
              </div>
            ) : null}

            <span className={`upload-status ${file.status}`}>
              {statusLabel[file.status]}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Email Forwarding tab ── */
function EmailTab({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: (text: string) => void;
}) {
  const email = "athgadlang.solvevia@in.solvevia.com";

  return (
    <div className="tab-card">
      <div className="tab-card-title">Email Forwarding</div>
      <div className="tab-card-sub">
        Forward invoices directly from your email. Each document is
        automatically ingested and queued for AI extraction.
      </div>

      <div className="email-box">
        <span className="email-address">{email}</span>
        <button
          className={`copy-btn${copied ? " copied" : ""}`}
          onClick={() => onCopy(email)}
        >
          {copied ? (
            <>
              <Check size={12} strokeWidth={2} />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} strokeWidth={1.7} />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="instructions">
        <div className="instruction-step">
          <span className="step-num">1</span>
          Forward any invoice email to the address above
        </div>
        <div className="instruction-step">
          <span className="step-num">2</span>
          PDF and image attachments are automatically extracted
        </div>
        <div className="instruction-step">
          <span className="step-num">3</span>
          Documents appear in your Inbox within 30 seconds
        </div>
        <div className="instruction-step">
          <span className="step-num">4</span>
          Email body text is ignored — only attachments are processed
        </div>
      </div>
    </div>
  );
}

/* ── Google Drive tab ── */
function DriveTab() {
  return (
    <div className="tab-card">
      <div className="tab-card-title">Google Drive</div>
      <div className="tab-card-sub">
        Automatically ingest invoices from a connected Google Drive folder.
        New files are detected and processed within minutes.
      </div>

      <div className="drive-status">
        <div className="drive-status-icon">
          <CheckCircle size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="drive-status-label">Connected</div>
          <div className="drive-status-sub">
            Athgadlang QBO Uploads
          </div>
        </div>
      </div>

      <div className="drive-folder">
        <FolderOpen size={16} strokeWidth={1.7} className="drive-folder-icon" />
        <div>
          <div className="drive-folder-name">Invoices - 2026</div>
          <div className="drive-folder-path">/ATH/Invoices - 2026</div>
        </div>
        <span className="drive-folder-badge">Active</span>
      </div>
      <div className="drive-folder">
        <FolderOpen size={16} strokeWidth={1.7} className="drive-folder-icon" />
        <div>
          <div className="drive-folder-name">Receipts</div>
          <div className="drive-folder-path">/ATH/Receipts</div>
        </div>
        <span className="drive-folder-badge">Active</span>
      </div>
    </div>
  );
}

/* ── Mobile Capture tab ── */
function MobileTab({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: (text: string) => void;
}) {
  const link = "m.solvevia.com";

  return (
    <div className="tab-card">
      <div className="tab-card-title">Mobile Capture</div>
      <div className="tab-card-sub">
        Snap a photo of any receipt or invoice from your phone.
        Documents are uploaded instantly and queued for extraction.
      </div>

      <div className="mobile-layout">
        <div className="qr-placeholder">
          <QrCode size={48} strokeWidth={1} />
          <span className="qr-placeholder-label">QR Code</span>
        </div>
        <div className="mobile-info">
          <div className="tab-card-sub" style={{ marginBottom: 0 }}>
            Scan this QR code or visit:
          </div>
          <div className="mobile-link-box">
            <span className="mobile-link">{link}</span>
            <button
              className={`copy-btn${copied ? " copied" : ""}`}
              onClick={() => onCopy(link)}
            >
              {copied ? (
                <>
                  <Check size={12} strokeWidth={2} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} strokeWidth={1.7} />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="mobile-features">
            <div className="mobile-feature">
              <Camera size={14} strokeWidth={1.7} />
              Auto-crop and enhance document photos
            </div>
            <div className="mobile-feature">
              <Zap size={14} strokeWidth={1.7} />
              Instant upload over mobile data or WiFi
            </div>
            <div className="mobile-feature">
              <Shield size={14} strokeWidth={1.7} />
              End-to-end encrypted transfer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
