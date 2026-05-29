"use client";

import AppShell from "@/components/AppShell";
import { useEffect } from "react";
import api from "@/lib/api";
import type { TaskStatus } from "@/lib/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Flag, Calendar, MessageSquare, GripVertical } from "lucide-react";
import { useTaskStore } from "@/lib/stores/tasks";
import TaskDetailModal from "@/components/TaskDetailModal";
import { useState } from "react";

const columns: { id: TaskStatus; label: string; color: string; gradient: string }[] = [
  { id: "TODO", label: "To Do", color: "border-blue-500/30", gradient: "from-blue-500 to-blue-600" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-amber-500/30", gradient: "from-amber-500 to-orange-500" },
  { id: "REVIEW", label: "In Review", color: "border-purple-500/30", gradient: "from-purple-500 to-violet-600" },
  { id: "DONE", label: "Done", color: "border-emerald-500/30", gradient: "from-emerald-500 to-green-600" },
];

const priorityColors: Record<string, string> = {
  LOW: "text-blue-400 bg-blue-500/10",
  MEDIUM: "text-amber-400 bg-amber-500/10",
  HIGH: "text-orange-400 bg-orange-500/10",
  CRITICAL: "text-red-400 bg-red-500/10",
};

export default function KanbanBoardPage() {
  const { tasks, isLoading, fetchMyTasks } = useTaskStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => { 
    fetchMyTasks(); 
  }, [fetchMyTasks]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;

    // We can confidently update the Zustand store tasks array optimistically
    // We get the current store state first:
    const store = useTaskStore.getState();
    const prevTasks = [...store.tasks];
    
    // Update local store immediately
    store.setTasks(
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    } catch {
      // Revert on error
      store.setTasks(prevTasks);
      fetchMyTasks(); 
    }
  };

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <TaskDetailModal 
          taskId={selectedTaskId} 
          isOpen={!!selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Drag and drop tasks to update status
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-[hsl(var(--card))] animate-pulse" />
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map((col) => {
                const colTasks = getColumnTasks(col.id);
                return (
                  <div key={col.id} className={`flex flex-col h-[calc(100vh-160px)] min-h-[500px] rounded-3xl bg-[hsl(var(--card))] border-t-2 ${col.color} border border-[hsl(var(--border))] p-4`}>
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${col.gradient}`} />
                        <h3 className="text-sm font-semibold">{col.label}</h3>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Droppable area */}
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 overflow-y-auto space-y-2 transition-colors rounded-2xl p-1 scrollbar-thin scrollbar-thumb-[hsl(var(--border))] scrollbar-track-transparent ${
                            snapshot.isDraggingOver ? "bg-[hsl(var(--primary)/0.05)]" : ""
                          }`}
                        >
                          {colTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  onClick={() => setSelectedTaskId(task.id)}
                                  className={`rounded-2xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-3 transition-shadow cursor-pointer ${
                                    snapshot.isDragging ? "shadow-xl shadow-black/10 ring-2 ring-[hsl(var(--primary)/0.3)]" : "hover:shadow-md"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-0.5 text-[hsl(var(--muted-foreground)/0.4)] hover:text-[hsl(var(--muted-foreground))] cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{task.title}</p>
                                      {task.project && (
                                        <p className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-1">
                                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: task.project.color }} />
                                          {task.project.name}
                                        </p>
                                      )}

                                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${priorityColors[task.priority]}`}>
                                          {task.priority}
                                        </span>
                                        {task.dueDate && (
                                          <span className={`flex items-center gap-0.5 text-[10px] ${
                                            new Date(task.dueDate) < new Date() && task.status !== "DONE"
                                              ? "text-red-400"
                                              : "text-[hsl(var(--muted-foreground))]"
                                          }`}>
                                            <Calendar className="w-2.5 h-2.5" />
                                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                          </span>
                                        )}
                                      </div>

                                      {/* Footer */}
                                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[hsl(var(--border)/0.5)]">
                                        {task.assignee ? (
                                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-[hsl(var(--background))]">
                                            {(task.assignee.firstName?.[0] || "").toUpperCase()}{(task.assignee.lastName?.[0] || "").toUpperCase()}
                                          </div>
                                        ) : (
                                          <div className="w-5 h-5 rounded-full bg-[hsl(var(--secondary))] border border-dashed border-[hsl(var(--border))]" />
                                        )}
                                        {task._count?.comments !== undefined && task._count.comments > 0 && (
                                          <span className="flex items-center gap-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                                            <MessageSquare className="w-2.5 h-2.5" />
                                            {task._count.comments}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>
    </AppShell>
  );
}
