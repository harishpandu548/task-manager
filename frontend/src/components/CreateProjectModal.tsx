import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "./Modal";
import api from "@/lib/api";
import { useProjectStore } from "@/lib/stores/projects";
import { Loader2 } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B", "#10B981", "#14B8A6", "#6366F1"
];

export default function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const { fetchProjects } = useProjectStore();
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setError("");
      await api.post("/projects", { ...data, color: selectedColor });
      await fetchProjects();
      reset();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Project"
      description="Create a new workspace for your team's tasks."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Project Name</label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all"
            placeholder="e.g., Q3 Website Redesign"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Description (Optional)</label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] outline-none transition-all min-h-[100px] resize-none"
            placeholder="Briefly describe what this project is about..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Project Color</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  selectedColor === c ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--card))] ring-[hsl(var(--foreground))] scale-110" : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
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
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm font-semibold hover:bg-[hsl(var(--foreground)/0.9)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
