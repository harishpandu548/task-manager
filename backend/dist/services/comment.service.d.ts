export declare const commentService: {
    create(data: {
        content: string;
        taskId: string;
        userId: string;
    }): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        taskId: string;
    }>;
    getByTask(taskId: string, page?: number, limit?: number): Promise<{
        comments: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            taskId: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    delete(id: string, userId: string): Promise<void>;
};
//# sourceMappingURL=comment.service.d.ts.map