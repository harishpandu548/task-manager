"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTaskStore } from "@/lib/stores/tasks";
import { useAuthStore } from "@/lib/stores/auth";
import type { Task, Priority, TaskStatus } from "@/lib/types";
import {
  Plus,
  Filter,
  Calendar,
  MessageSquare,
  Flag,
  ChevronDown,
  X,
} from "lucide-react";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskDetailModal from "@/components/TaskDetailModal";

const priorityConfig: Record<Priority, { color: string; bg: string }> = {
  LOW: { color: "text-blue-400", bg: "bg-blue-500/10" },
  MEDIUM: { color: "text-amber-400", bg: "bg-amber-500/10" },
  HIGH: { color: "text-orange-400", bg: "bg-orange-500/10" },
  CRITICAL: { color: "text-red-400", bg: "bg-red-500/10" },
};

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  TODO: { label: "To Do", color: "text-blue-400", bg: "bg-blue-500/10" },
  IN_PROGRESS: { label: "In Progress", color: "text-amber-400", bg: "bg-amber-500/10" },
  REVIEW: { label: "In Review", color: "text-purple-400", bg: "bg-purple-500/10" },
  DONE: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function TasksPage() {
  const { tasks, isLoading, fetchMyTasks, fetchCreatedByMeTasks, setFilters, clearFilters, filters } = useTaskStore();
  const { user } = useAuthStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<"MY_TASKS" | "ASSIGNED_BY_ME">("MY_TASKS");

  const searchParams = useSearchParams();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setSelectedTaskId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (viewMode === "MY_TASKS") {
      fetchMyTasks();
    } else {
      fetchCreatedByMeTasks();
    }
  }, [fetchMyTasks, fetchCreatedByMeTasks, viewMode]);

  const canAssignTasks = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <TaskDetailModal 
          taskId={selectedTaskId} 
          isOpen={!!selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {viewMode === "MY_TASKS" ? "My Tasks" : "Assigned by Me"}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {tasks.length} {viewMode === "MY_TASKS" ? "tasks assigned to you" : "tasks you assigned"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canAssignTasks && (
              <div className="flex bg-[hsl(var(--secondary))] rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("MY_TASKS")}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    viewMode === "MY_TASKS"
                      ? "bg-[hsl(var(--background))] shadow-sm text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                >
                  My Tasks
                </button>
                <button
                  onClick={() => setViewMode("ASSIGNED_BY_ME")}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    viewMode === "ASSIGNED_BY_ME"
                      ? "bg-[hsl(var(--background))] shadow-sm text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                >
                  Assigned by Me
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[hsl(var(--secondary))] text-sm font-medium hover:bg-[hsl(var(--secondary)/0.8)] transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-white text-xs flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[hsl(245,82%,67%/0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] animate-fade-in">
            <select
              value={filters.status || ""}
              onChange={(e) => setFilters({ status: (e.target.value || undefined) as TaskStatus | undefined })}
              className="px-3 py-2 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
            <select
              value={filters.priority || ""}
              onChange={(e) => setFilters({ priority: (e.target.value || undefined) as Priority | undefined })}
              className="px-3 py-2 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        )}

        <CreateTaskModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />

        {/* Task list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-3xl bg-[hsl(var(--card))] animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {Object.keys(filters).length > 0 ? "Try adjusting your filters" : "You&apos;re all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={() => setSelectedTaskId(task.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TaskRow({ task, index, onClick }: { task: Task; index: number; onClick: () => void }) {
  const sc = statusConfig[task.status];
  const pc = priorityConfig[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:shadow-md hover:border-[hsl(var(--primary)/0.2)] transition-all duration-200 group cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Status badge */}
      <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${sc.bg} ${sc.color}`}>
        {sc.label}
      </span>

      {/* Title & project */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{task.title}</p>
        {task.project && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: task.project.color }} />
            {task.project.name}
          </p>
        )}
      </div>

      {/* Priority */}
      <span className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium ${pc.bg} ${pc.color}`}>
        <Flag className="w-3 h-3" />
        {task.priority}
      </span>

      {/* Due date */}
      {task.dueDate && (
        <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : "text-[hsl(var(--muted-foreground))]"}`}>
          <Calendar className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}

      {/* Comments count */}
      {task._count?.comments !== undefined && task._count.comments > 0 && (
        <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
          <MessageSquare className="w-3 h-3" />
          {task._count.comments}
        </span>
      )}

      {/* Assignee avatar */}
        {task.assignee && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[hsl(var(--background))] flex-shrink-0 transition-transform hover:scale-105">
            {(task.assignee.firstName?.[0] || "").toUpperCase()}{(task.assignee.lastName?.[0] || "").toUpperCase()}
          </div>
        )}
    </div>
  );
}
