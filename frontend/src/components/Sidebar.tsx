"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Columns3,
  BarChart3,
  Shield,
  LogOut,
  Zap,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "My Tasks", icon: CheckSquare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/board", label: "Kanban Board", icon: Columns3 },
  { href: "/analytics", label: "Analytics", icon: BarChart3, roles: ["ADMIN", "MANAGER"] },
  { href: "/admin", label: "Admin Panel", icon: Shield, roles: ["ADMIN"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40",
        "bg-hsl(var(--card)) border-r border-[hsl(var(--border))]",
        "glass",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[hsl(var(--border))]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center shadow-lg shadow-[hsl(245,82%,67%)/0.3]">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] bg-clip-text text-transparent">
            TaskFlow
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => !item.roles || (user && item.roles.includes(user.role)))
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                  "hover:bg-[hsl(var(--primary)/0.08)]",
                  isActive
                    ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-sm")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[hsl(var(--border))]">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-sm font-medium transition-all",
            "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.08)]",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center shadow-md hover:bg-[hsl(var(--secondary))] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
