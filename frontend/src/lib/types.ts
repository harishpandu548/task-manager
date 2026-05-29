export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  isArchived?: boolean;
  _count?: { tasks: number; members: number };
  members?: ProjectMember[];
  tasks?: Task[];
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: Role;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar' | 'email'>;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  position: number;
  isDeleted: boolean;
  projectId: string;
  assigneeId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  project?: Pick<Project, 'id' | 'name' | 'color'>;
  assignee?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  createdBy?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  comments?: Comment[];
  activityLogs?: ActivityLog[];
  _count?: { comments: number };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  taskId: string;
  userId: string;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  createdAt: string;
  userId: string;
  taskId?: string;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  task?: Pick<Task, 'id' | 'title'>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardStats {
  tasksByStatus: { status: TaskStatus; count: number }[];
  tasksByPriority: { priority: Priority; count: number }[];
  overdueTasks: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  recentActivity: ActivityLog[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
