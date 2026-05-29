import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "./Modal";
import api from "@/lib/api";
import { useTaskStore } from "@/lib/stores/tasks";
import { Loader2 } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function CreateTaskModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const { fetchMyTasks } = useTaskStore();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setIsLoadingMetadata(true);
      
      Promise.all([
        api.get("/projects", { params: { limit: 100 } }),
        api.get("/users", { params: { limit: 100 } })
      ])
      .then(([projectsRes, usersRes]) => {
        if (!isMounted) return;
        setProjects(projectsRes.data.data.projects || projectsRes.data.data);
        setUsers(usersRes.data.data.users || usersRes.data.data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoadingMetadata(false);
      });

      return () => { isMounted = false; };
    }
  }, [isOpen]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setError("");
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };
      await api.post("/tasks", payload);
      await fetchMyTasks();
      reset();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Task"
      description="Create a new task and assign it to your team."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Task Title</label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all"
            placeholder="e.g., Update Landing Page"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Description (Optional)</label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all min-h-[80px] resize-none"
            placeholder="What needs to be done?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Project</label>
            <select
              {...register("projectId")}
              className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all appearance-none"
              disabled={isLoadingMetadata}
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Assignee (Optional)</label>
            <select
              {...register("assigneeId")}
              className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all appearance-none"
              disabled={isLoadingMetadata}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Priority</label>
            <select
              {...register("priority")}
              className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all appearance-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Due Date (Optional)</label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-[hsl(var(--secondary))] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingMetadata}
            className="px-6 py-2.5 rounded-2xl bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm font-semibold hover:bg-[hsl(var(--foreground)/0.9)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
