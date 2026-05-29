import { Role } from '@prisma/client';
import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { analyticsService } from './analytics.service.js';

export const projectService = {
  async getAll(userId: string, userRole: Role, search?: string) {
    const where: any = {}; // Make all projects visible to all users for demo purposes
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.project.findMany({
      where: { ...where, isArchived: false },
      include: {
        _count: { select: { tasks: true, members: true } },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
          take: 5,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          where: { isDeleted: false },
          include: {
            assignee: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { position: 'asc' },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true, role: true },
            },
          },
        },
        _count: { select: { tasks: true, members: true } },
      },
    });
    if (!project) throw ApiError.notFound('Project not found');
    return project;
  },

  async create(data: { name: string; description?: string; color?: string }, userId: string) {
    const project = await prisma.project.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: userId },
        },
        manager: {
          connect: { id: userId },
        },
        members: {
          create: { userId, role: 'ADMIN' },
        },
      },
      include: { _count: { select: { tasks: true, members: true } } },
    });
    await analyticsService.clearCache();
    return project;
  },

  async update(id: string, data: { name?: string; description?: string; color?: string; isArchived?: boolean }) {
    return prisma.project.update({ where: { id }, data });
  },

  async addMember(projectId: string, userId: string, role: Role = 'EMPLOYEE') {
    const existing = await prisma.projectMember.findFirst({
      where: { userId, projectId },
    });
    if (existing) throw ApiError.conflict('User already a member of this project');

    const member = await prisma.projectMember.create({
      data: { projectId, userId, role },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    await analyticsService.clearCache();
    return member;
  },

  async removeMember(projectId: string, userId: string) {
    await prisma.projectMember.deleteMany({
      where: { projectId, userId },
    });
    await analyticsService.clearCache();
  },

  async delete(id: string) {
    await prisma.project.update({ where: { id }, data: { isArchived: true } });
  },
};
