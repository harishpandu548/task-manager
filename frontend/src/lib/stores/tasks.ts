import { create } from 'zustand';
import api from '../api';
import type { Task, TaskStatus, Priority } from '../types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  filters: {
    status?: TaskStatus;
    priority?: Priority;
    projectId?: string;
    search?: string;
  };
  fetchTasks: () => Promise<void>;
  fetchMyTasks: () => Promise<void>;
  fetchCreatedByMeTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  clearFilters: () => void;
  setTasks: (tasks: Task[]) => void;
  clearCurrentTask: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  filters: {},
  setTasks: (tasks) => set({ tasks }),
  clearCurrentTask: () => set({ currentTask: null }),

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const params = get().filters;
      const res = await api.get('/tasks', { params });
      set({ tasks: res.data.data.tasks || res.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchMyTasks: async () => {
    set({ isLoading: true });
    try {
      const params = get().filters;
      const res = await api.get('/tasks/my', { params });
      set({ tasks: res.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCreatedByMeTasks: async () => {
    set({ isLoading: true });
    try {
      const params = get().filters;
      const res = await api.get('/tasks/created', { params });
      set({ tasks: res.data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchTaskById: async (id: string) => {
    try {
      const res = await api.get(`/tasks/${id}`);
      set({ currentTask: res.data.data });
    } catch {}
  },

  createTask: async (data) => {
    await api.post('/tasks', data);
    await get().fetchTasks();
  },

  updateTask: async (id, data) => {
    await api.patch(`/tasks/${id}`, data);
    await get().fetchTasks();
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    await get().fetchTasks();
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
    get().fetchTasks();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchTasks();
  },
}));
