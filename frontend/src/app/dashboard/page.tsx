"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Users,
} from "lucide-react";

const statusColors: Record<string, string> = {
  TODO: "from-blue-500 to-blue-600",
  IN_PROGRESS: "from-amber-500 to-orange-500",
  REVIEW: "from-purple-500 to-violet-600",
  DONE: "from-emerald-500 to-green-600",
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "In Review",
  DONE: "Done",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/dashboard")
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Overview of your workspace
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-[hsl(var(--card))] animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={<BarChart3 className="w-5 h-5" />}
                color="from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)]"
                trend="+12%"
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="from-emerald-500 to-green-600"
                subtitle={`${stats.completionRate}% completion rate`}
              />
              <StatCard
                title="Overdue"
                value={stats.overdueTasks}
                icon={<AlertTriangle className="w-5 h-5" />}
                color="from-red-500 to-rose-600"
                alert={stats.overdueTasks > 0}
              />
              <StatCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                color="from-cyan-500 to-blue-600"
              />
            </div>

            {/* Task distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* By Status */}
              <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
                <h3 className="text-sm font-semibold mb-4 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Tasks by Status
                </h3>
                <div className="space-y-3">
                  {stats.tasksByStatus.map((item) => (
                    <div key={item.status} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{statusLabels[item.status] || item.status}</span>
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">{item.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${statusColors[item.status]} transition-all duration-700`}
                            style={{ width: `${stats.totalTasks > 0 ? (item.count / stats.totalTasks) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Priority */}
              <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
                <h3 className="text-sm font-semibold mb-4 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Tasks by Priority
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {stats.tasksByPriority.map((item) => {
                    const colors: Record<string, string> = {
                      LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                      CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
                    };
                    return (
                      <div
                        key={item.priority}
                        className={`rounded-2xl border p-4 ${colors[item.priority]}`}
                      >
                        <p className="text-2xl font-bold">{item.count}</p>
                        <p className="text-xs font-medium mt-1 opacity-80">{item.priority}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
              <h3 className="text-sm font-semibold mb-4 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[hsl(var(--secondary))] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {log.user.firstName?.[0]}{log.user.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{log.user.firstName} {log.user.lastName}</span>{" "}
                          <span className="text-[hsl(var(--muted-foreground))]">{log.action.toLowerCase().replace(/_/g, " ")}</span>
                          {log.task && (
                            <span className="font-medium"> &quot;{log.task.title}&quot;</span>
                          )}
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-[hsl(var(--muted-foreground))]">Failed to load dashboard</p>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
  alert,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  subtitle?: string;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 hover:shadow-lg transition-shadow duration-300 ${alert ? "ring-2 ring-[hsl(var(--destructive)/0.3)]" : ""}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{subtitle || title}</p>
    </div>
  );
}
