import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    color: z.string().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    isArchived: z.boolean().optional(),
  }),
});

export const addProjectMemberSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    userId: z.string(),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    projectId: z.string(),
    assigneeId: z.string().optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    position: z.number().optional(),
  }),
});

export const assignTaskSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    assigneeId: z.string().min(1),
  }),
});

export const changeTaskStatusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    taskId: z.string(),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    projectId: z.string().optional(),
    assigneeId: z.string().optional(),
    search: z.string().optional(),
    dueDateFrom: z.string().datetime().optional(),
    dueDateTo: z.string().datetime().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
