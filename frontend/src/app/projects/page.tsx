"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useProjectStore } from "@/lib/stores/projects";
import { useAuthStore } from "@/lib/stores/auth";
import Link from "next/link";
import { Plus, FolderKanban, Users, CheckSquare } from "lucide-react";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function ProjectsPage() {
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {projects.length} active projects
            </p>
          </div>
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[hsl(245,82%,67%/0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          )}
        </div>

        <CreateProjectModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-3xl bg-[hsl(var(--card))] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6 hover:shadow-lg hover:border-[hsl(var(--primary)/0.2)] transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${project.color}dd, ${project.color}88)` }}
                  >
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="font-semibold text-lg mt-4 group-hover:text-[hsl(var(--primary))] transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[hsl(var(--border))]">
                  <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                    <CheckSquare className="w-3.5 h-3.5" />
                    {project._count?.tasks || 0} tasks
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                    <Users className="w-3.5 h-3.5" />
                    {project._count?.members || 0} members
                  </span>
                </div>

                {project.members && project.members.length > 0 && (
                  <div className="flex -space-x-2 mt-3">
                    {project.members.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-[10px] font-bold border-2 border-[hsl(var(--card))]"
                        title={`${m.user.firstName} ${m.user.lastName}`}
                      >
                        {m.user.firstName?.[0]}{m.user.lastName?.[0]}
                      </div>
                    ))}
                    {project.members.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center text-[10px] font-bold border-2 border-[hsl(var(--card))]">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
