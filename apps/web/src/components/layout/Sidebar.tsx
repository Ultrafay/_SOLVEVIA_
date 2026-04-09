"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  Upload,
  Star,
  List,
  Copy,
  Flag,
  Layers,
  Shield,
  RefreshCw,
  Folder,
  Users,
  Sun,
} from "lucide-react";
import "./sidebar.css";

const navSections = [
  {
    label: "Capture",
    items: [
      { icon: Inbox, label: "Inbox", href: "/inbox", badge: 8 },
      { icon: Upload, label: "Upload", href: "/upload" },
      { icon: Star, label: "Review Queue", href: "/review", badge: 3, badgeRed: true },
    ],
  },
  {
    label: "Pipeline",
    items: [
      { icon: List, label: "All Documents", href: "/documents" },
      { icon: Copy, label: "Duplicates", href: "/duplicates", badge: 2 },
      { icon: Flag, label: "GL Mapping", href: "/gl-mapping" },
      { icon: Layers, label: "Supplier Rules", href: "/supplier-rules" },
      { icon: Shield, label: "Vault", href: "/vault" },
    ],
  },
  {
    label: "Integrations",
    items: [
      { icon: RefreshCw, label: "QBO Sync", href: "/integrations/qbo" },
      { icon: Folder, label: "Google Drive", href: "/integrations/drive" },
    ],
  },
  {
    label: "Org",
    items: [
      { icon: Users, label: "Clients", href: "/clients" },
      { icon: Sun, label: "Settings", href: "/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo-wrap">
        <div className="logo-short">
          <div className="logo-mark">S</div>
        </div>
        <div className="logo-full">Solvevia</div>
      </div>

      {/* Nav sections */}
      {navSections.map((section) => (
        <div key={section.label} className="nav-section">
          <div className="nav-section-label">{section.label}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ni${active ? " active" : ""}`}
              >
                <Icon size={15} strokeWidth={1.7} />
                <span className="nav-label">{item.label}</span>
                {item.badge != null && (
                  <span className={`nb${item.badgeRed ? " r" : ""}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* Spacer */}
      <div className="sb-spacer" />

      {/* User */}
      <div className="sb-user">
        <div className="ua">MZ</div>
        <div className="un">Muzammil &middot; Solvevia</div>
      </div>
    </aside>
  );
}
