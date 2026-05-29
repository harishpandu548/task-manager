import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { activityLogService } from './activityLog.service.js';
export const commentService = {
    async create(data) {
        const task = await prisma.task.findUnique({ where: { id: data.taskId } });
        if (!task || task.isDeleted)
            throw ApiError.notFound('Task not found');
        const comment = await prisma.comment.create({
            data: {
                content: data.content,
                taskId: data.taskId,
                userId: data.userId,
            },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            },
        });
        await activityLogService.log({
            action: 'COMMENT_ADDED',
            entityType: 'Comment',
            entityId: comment.id,
            userId: data.userId,
            taskId: data.taskId,
        });
        return comment;
    },
    async getByTask(taskId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where: { taskId },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.comment.count({ where: { taskId } }),
        ]);
        return { comments, total, page, limit };
    },
    async delete(id, userId) {
        const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw ApiError.notFound('Comment not found');
        if (comment.userId !== userId)
            throw ApiError.forbidden('Cannot delete another user\'s comment');
        await prisma.comment.delete({ where: { id } });
    },
};
//# sourceMappingURL=comment.service.js.map