"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useTaskStore } from "@/lib/stores/tasks";
import { format } from "date-fns";
import api from "@/lib/api";
import { 
  Calendar, 
  Flag, 
  MessageSquare, 
  Activity, 
  Clock, 
  User,
  Send,
  Loader2
} from "lucide-react";
import type { Task, Comment } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/auth";

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function TaskDetailModal({ taskId, isOpen, onClose }: TaskDetailModalProps) {
  const { currentTask, fetchTaskById, clearCurrentTask } = useTaskStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"COMMENTS" | "ACTIVITY">("COMMENTS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<any[]>([]);

  const { register, handleSubmit, reset } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskById(taskId);
    } else {
      clearCurrentTask();
      setLocalComments([]);
      setActiveTab("COMMENTS");
    }
  }, [isOpen, taskId, fetchTaskById, clearCurrentTask]);

  useEffect(() => {
    if (currentTask?.comments) {
      setLocalComments(currentTask.comments);
    }
  }, [currentTask]);

  const onSubmitComment = async (data: CommentFormData) => {
    if (!taskId) return;
    setIsSubmitting(true);
    try {
      const res = await api.post("/comments", {
        content: data.content,
        taskId: taskId,
      });
      // Optimistically add comment
      setLocalComments((prev) => [res.data.data, ...prev]);
      reset();
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentTask && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading Task...">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
        </div>
      </Modal>
    );
  }

  if (!currentTask) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="3xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Task Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
                {currentTask.status.replace("_", " ")}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-orange-500/10 text-orange-400">
                <Flag className="w-3 h-3" />
                {currentTask.priority}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentTask.title}</h2>
            <div className="text-sm text-[hsl(var(--muted-foreground))] whitespace-pre-wrap bg-[hsl(var(--secondary)/0.5)] p-4 rounded-2xl border border-[hsl(var(--border))]">
              {currentTask.description || "No description provided."}
            </div>
          </div>

          {/* Tabs for comments & activity */}
          <div className="border border-[hsl(var(--border))] rounded-3xl overflow-hidden bg-[hsl(var(--card))]">
            <div className="flex border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary)/0.5)]">
              <button
                onClick={() => setActiveTab("COMMENTS")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "COMMENTS" 
                    ? "text-[hsl(var(--foreground))] border-b-2 border-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments
                  {localComments.length > 0 && (
                    <span className="bg-[hsl(var(--secondary))] px-1.5 py-0.5 rounded-md text-[10px]">
                      {localComments.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("ACTIVITY")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "ACTIVITY" 
                    ? "text-[hsl(var(--foreground))] border-b-2 border-[hsl(var(--primary))]" 
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activity
                </div>
              </button>
            </div>

            <div className="p-4 bg-[hsl(var(--background))] min-h-[300px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[hsl(var(--border))]">
              {activeTab === "COMMENTS" ? (
                <div className="space-y-4">
                  {/* Comment form */}
                  <form onSubmit={handleSubmit(onSubmitComment)} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--ring))] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user?.firstName?.[0] || "U"}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        {...register("content")}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 rounded-xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4 mt-6">
                    {localComments.length === 0 ? (
                      <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-8">
                        No comments yet. Be the first to start the discussion!
                      </p>
                    ) : (
                      localComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 animate-fade-in">
                          <div className="w-8 h-8 rounded-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {comment.user?.firstName?.[0]?.toUpperCase()}{comment.user?.lastName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between mb-1">
                              <span className="text-sm font-semibold">
                                {comment.user?.firstName} {comment.user?.lastName}
                              </span>
                              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                              </span>
                            </div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[hsl(var(--border))] before:to-transparent">
                  {currentTask.activityLogs?.length === 0 ? (
                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-8 relative z-10 bg-[hsl(var(--background))]">
                      No activity recorded yet.
                    </p>
                  ) : (
                    currentTask.activityLogs?.map((log: any, i: number) => (
                      <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[hsl(var(--background))] bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shrink-0 z-10 text-[10px] font-bold">
                          {log.user?.firstName?.[0]?.toUpperCase()}{log.user?.lastName?.[0]?.toUpperCase()}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-xs text-[hsl(var(--foreground))]">
                              {log.user?.firstName} {log.user?.lastName}
                            </div>
                            <time className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">
                              {format(new Date(log.createdAt), "MMM d, h:mm a")}
                            </time>
                          </div>
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">
                            {formatActivityAction(log.action)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Meta Info */}
        <div className="space-y-4">
          <div className="bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border))] rounded-3xl p-4 space-y-4">
            <h3 className="text-sm font-semibold border-b border-[hsl(var(--border))] pb-2">Properties</h3>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Project</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full" style={{ background: currentTask.project?.color || "#555" }} />
                  {currentTask.project?.name || "No Project"}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Assignee</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {currentTask.assignee ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-[10px] font-bold">
                        {currentTask.assignee.firstName?.[0]?.toUpperCase()}{currentTask.assignee.lastName?.[0]?.toUpperCase()}
                      </div>
                      {currentTask.assignee.firstName} {currentTask.assignee.lastName}
                    </>
                  ) : (
                    <span className="text-[hsl(var(--muted-foreground))] italic">Unassigned</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Reporter</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {currentTask.createdBy ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110">
                        {currentTask.createdBy.firstName?.[0]?.toUpperCase()}{currentTask.createdBy.lastName?.[0]?.toUpperCase()}
                      </div>
                      {currentTask.createdBy.firstName} {currentTask.createdBy.lastName}
                    </>
                  ) : (
                    <span className="text-[hsl(var(--muted-foreground))] italic">System</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Due Date</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  {currentTask.dueDate ? format(new Date(currentTask.dueDate), "MMM d, yyyy") : "No due date"}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">Created</span>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {format(new Date(currentTask.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
}

function formatActivityAction(action: string) {
  switch (action) {
    case "TASK_CREATED": return "Created the task";
    case "TASK_UPDATED": return "Updated task details";
    case "TASK_STATUS_CHANGED": return "Changed the task status";
    case "TASK_ASSIGNED": return "Changed the task assignee";
    case "COMMENT_ADDED": return "Commented on the task";
    default: return action.replace(/_/g, " ").toLowerCase();
  }
}
