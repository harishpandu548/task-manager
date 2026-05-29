import { create } from 'zustand';
import api from '../api';
import type { Project } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/projects');
      set({ projects: res.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchProjectById: async (id: string) => {
    try {
      const res = await api.get(`/projects/${id}`);
      set({ currentProject: res.data.data });
    } catch {}
  },

  createProject: async (data) => {
    await api.post('/projects', data);
    await get().fetchProjects();
  },

  updateProject: async (id, data) => {
    await api.patch(`/projects/${id}`, data);
    await get().fetchProjects();
  },
}));
