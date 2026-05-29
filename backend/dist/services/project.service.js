import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
export const projectService = {
    async getAll(userId, userRole) {
        const where = userRole === 'ADMIN'
            ? {}
            : { members: { some: { userId } } };
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
    async getById(id) {
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
        if (!project)
            throw ApiError.notFound('Project not found');
        return project;
    },
    async create(data, userId) {
        return prisma.project.create({
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
    },
    async update(id, data) {
        return prisma.project.update({ where: { id }, data });
    },
    async addMember(projectId, userId, role = 'EMPLOYEE') {
        const existing = await prisma.projectMember.findFirst({
            where: { userId, projectId },
        });
        if (existing)
            throw ApiError.conflict('User already a member of this project');
        return prisma.projectMember.create({
            data: { projectId, userId, role },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
    },
    async removeMember(projectId, userId) {
        await prisma.projectMember.deleteMany({
            where: { projectId, userId },
        });
    },
    async delete(id) {
        await prisma.project.update({ where: { id }, data: { isArchived: true } });
    },
};
//# sourceMappingURL=project.service.js.map