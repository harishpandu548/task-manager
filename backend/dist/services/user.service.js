import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
export const userService = {
    async getAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    avatar: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count(),
        ]);
        return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    async getById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                _count: { select: { assignedTasks: true, createdTasks: true } },
            },
        });
        if (!user)
            throw ApiError.notFound('User not found');
        return user;
    },
    async create(data) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw ApiError.conflict('Email already in use');
        const hashedPassword = await bcrypt.hash(data.password, 12);
        return prisma.user.create({
            data: { ...data, password: hashedPassword },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
    },
    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
            },
        });
    },
    async delete(id) {
        await prisma.user.update({ where: { id }, data: { isActive: false } });
    },
};
//# sourceMappingURL=user.service.js.map