"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { BarChart3, TrendingUp, Users, FolderKanban } from "lucide-react";

interface ProjectCompletion {
  id: string;
  name: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
}

interface WeeklyData {
  date: string;
  count: number;
}

interface TasksPerUser {
  user: { id: string; firstName: string; lastName: string; avatar?: string } | null;
  totalTasks: number;
  completedTasks: number;
}

export default function AnalyticsPage() {
  const [projectCompletion, setProjectCompletion] = useState<ProjectCompletion[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [tasksPerUser, setTasksPerUser] = useState<TasksPerUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/project-completion"),
      api.get("/analytics/weekly-productivity"),
      api.get("/analytics/tasks-per-user"),
    ])
      .then(([pc, wp, tpu]) => {
        setProjectCompletion(pc.data.data);
        setWeeklyData(wp.data.data);
        setTasksPerUser(tpu.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxWeekly = Math.max(...weeklyData.map((d) => d.count), 1);

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Workspace performance insights
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-[hsl(var(--card))] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Weekly Productivity Chart */}
            <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6 col-span-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Weekly Productivity
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]" />
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">Tasks Completed</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-64 w-full">
                {/* SVG Line Graph */}
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0, 25, 50, 75, 100].map((tick) => (
                    <line
                      key={tick}
                      x1="0"
                      y1={200 - (tick * 2)}
                      x2="700"
                      y2={200 - (tick * 2)}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.3"
                    />
                  ))}

                  {/* Area beneath the line */}
                  <path
                    d={`M 0 200 ${weeklyData.map((d, i) => `L ${i * 100} ${200 - (d.count / maxWeekly * 150)}`).join(' ')} L 600 200 Z`}
                    fill="url(#lineGradient)"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {/* The actual line */}
                  <path
                    d={`M 0 ${200 - (weeklyData[0]?.count / maxWeekly * 150) || 200} ${weeklyData.map((d, i) => `L ${i * 100} ${200 - (d.count / maxWeekly * 150)}`).join(' ')}`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {/* Data Points */}
                  {weeklyData.map((day, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle
                        cx={i * 100}
                        cy={200 - (day.count / maxWeekly * 150)}
                        r="6"
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        className="transition-all duration-300 group-hover:r-8 group-hover:stroke-width-4 shadow-xl"
                      />
                      {/* Tooltip on circle hover */}
                      <foreignObject 
                        x={(i * 100) - 40} 
                        y={200 - (day.count / maxWeekly * 150) - 45} 
                        width="80" 
                        height="40" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      >
                        <div className="bg-[hsl(var(--primary))] text-white text-[10px] px-2 py-1 rounded-lg text-center font-bold shadow-lg">
                          {day.count} tasks
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[hsl(var(--primary))]" />
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-6 px-1">
                  {weeklyData.map((day, i) => (
                    <span key={i} className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-tighter">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Completion */}
            <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
              <div className="flex items-center gap-2 mb-4">
                <FolderKanban className="w-5 h-5 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Project Completion
                </h3>
              </div>
              <div className="space-y-4">
                {projectCompletion.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-md" style={{ background: p.color }} />
                        <span className="text-sm font-medium">{p.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{p.completionPercentage}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${p.completionPercentage}%`,
                          background: `linear-gradient(90deg, ${p.color}cc, ${p.color})`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                      {p.completedTasks}/{p.totalTasks} tasks completed
                    </p>
                  </div>
                ))}
                {projectCompletion.length === 0 && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">No projects</p>
                )}
              </div>
            </div>

            {/* Tasks Per User */}
            <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[hsl(var(--primary))]" />
                <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                  Tasks Per User
                </h3>
              </div>
              <div className="space-y-3">
                {tasksPerUser.map((item, i) => {
                  const completionPercentage = item.totalTasks > 0 
                    ? Math.round((item.completedTasks / item.totalTasks) * 100) 
                    : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        {(item.user?.firstName?.[0] || 'U')}{(item.user?.lastName?.[0] || '')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-semibold truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                            {item.user?.firstName} {item.user?.lastName}
                          </span>
                          <span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">
                            {item.completedTasks}/{item.totalTasks} ({completionPercentage}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[hsl(var(--secondary))] overflow-hidden border border-[hsl(var(--border)/0.5)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {tasksPerUser.length === 0 && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">No data</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
