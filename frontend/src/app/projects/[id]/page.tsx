"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useProjectStore } from "@/lib/stores/projects";
import { useParams } from "next/navigation";
import type { Task, TaskStatus, Priority } from "@/lib/types";
import api from "@/lib/api";
import { Calendar, Flag, MessageSquare, Users, CheckSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TaskDetailModal from "@/components/TaskDetailModal";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  TODO: { label: "To Do", color: "text-blue-400", bg: "bg-blue-500/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-amber-400", bg: "bg-amber-500/10" },
  REVIEW: { label: "In Review", color: "text-purple-400", bg: "bg-purple-500/10" },
  DONE: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const { currentProject, fetchProjectById } = useProjectStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProjectById(params.id as string);
      api.get(`/tasks/project/${params.id}`).then((res) => setTasks(res.data.data));
    }
  }, [params.id, fetchProjectById]);

  if (!currentProject) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] animate-pulse" />
        </div>
      </AppShell>
    );
  }

  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const completionPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <TaskDetailModal 
          taskId={selectedTaskId} 
          isOpen={!!selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-2 rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${currentProject.color}dd, ${currentProject.color}88)` }}
          >
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentProject.name}</h1>
            {currentProject.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{currentProject.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 text-center">
            <p className="text-2xl font-bold">{tasks.length}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Tasks</p>
          </div>
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{todoCount}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">To Do</p>
          </div>
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{inProgressCount}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">In Progress</p>
          </div>
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{completionPct}%</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Complete</p>
          </div>
        </div>

        {/* Members */}
        {currentProject.members && currentProject.members.length > 0 && (
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
            <h3 className="text-sm font-semibold mb-3 text-[hsl(var(--muted-foreground))] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> Members ({currentProject.members.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProject.members.map((m) => (
                <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[hsl(var(--secondary))]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[hsl(var(--background))]">
                    {(m.user.firstName?.[0] || "").toUpperCase()}{(m.user.lastName?.[0] || "").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.user.firstName} {m.user.lastName}</p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task list */}
        <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6">
          <h3 className="text-sm font-semibold mb-4 text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
            Tasks ({tasks.length})
          </h3>
          <div className="space-y-2">
            {tasks.map((task) => {
              const sc = statusConfig[task.status];
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[hsl(var(--secondary))] transition-colors cursor-pointer"
                >
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                  <p className="flex-1 text-sm font-medium truncate">{task.title}</p>
                  {task.assignee && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-[10px] font-bold transition-transform hover:scale-110">
                      {(task.assignee.firstName?.[0] || "").toUpperCase()}{(task.assignee.lastName?.[0] || "").toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}
            {tasks.length === 0 && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">No tasks yet</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
