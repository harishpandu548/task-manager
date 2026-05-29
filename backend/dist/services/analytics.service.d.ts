export declare const analyticsService: {
    getDashboardStats(userId?: string): Promise<{
        tasksByStatus: Array<{
            status: string;
            count: number;
        }>;
        tasksByPriority: Array<{
            priority: string;
            count: number;
        }>;
        overdueTasks: number;
        totalTasks: number;
        completedTasks: number;
        completionRate: number;
        recentActivity: unknown[];
    }>;
    getTasksPerUser(): Promise<{
        user: unknown;
        taskCount: number;
    }[]>;
    getProjectCompletion(): Promise<{
        id: string;
        name: string;
        color: string | null;
        totalTasks: number;
        completedTasks: number;
        completionPercentage: number;
    }[]>;
    getWeeklyProductivity(): Promise<{
        date: string;
        count: number;
    }[]>;
};
//# sourceMappingURL=analytics.service.d.ts.map