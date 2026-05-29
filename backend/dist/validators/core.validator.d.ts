import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["ADMIN", "MANAGER", "EMPLOYEE"]>>;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }, {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}, {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}>;
export declare const updateUserSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["ADMIN", "MANAGER", "EMPLOYEE"]>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }, {
        isActive?: boolean | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}>;
export declare const createProjectSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
    };
}, {
    body: {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
    };
}>;
export declare const updateProjectSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        isArchived: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        description?: string | undefined;
        color?: string | undefined;
        isArchived?: boolean | undefined;
    }, {
        name?: string | undefined;
        description?: string | undefined;
        color?: string | undefined;
        isArchived?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        color?: string | undefined;
        isArchived?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        description?: string | undefined;
        color?: string | undefined;
        isArchived?: boolean | undefined;
    };
}>;
export declare const addProjectMemberSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        userId: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["ADMIN", "MANAGER", "EMPLOYEE"]>>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }, {
        userId: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        userId: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        userId: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}>;
export declare const createTaskSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
        status: z.ZodOptional<z.ZodEnum<["TODO", "IN_PROGRESS", "REVIEW", "DONE"]>>;
        dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        projectId: z.ZodString;
        assigneeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        projectId: string;
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
    }, {
        title: string;
        projectId: string;
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title: string;
        projectId: string;
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
    };
}, {
    body: {
        title: string;
        projectId: string;
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
    };
}>;
export declare const updateTaskSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
        status: z.ZodOptional<z.ZodEnum<["TODO", "IN_PROGRESS", "REVIEW", "DONE"]>>;
        dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        assigneeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        position: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
        position?: number | undefined;
    }, {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
        position?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
        position?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        description?: string | undefined;
        title?: string | undefined;
        dueDate?: string | null | undefined;
        assigneeId?: string | null | undefined;
        position?: number | undefined;
    };
}>;
export declare const assignTaskSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        assigneeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        assigneeId: string;
    }, {
        assigneeId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        assigneeId: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        assigneeId: string;
    };
}>;
export declare const changeTaskStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodEnum<["TODO", "IN_PROGRESS", "REVIEW", "DONE"]>;
    }, "strip", z.ZodTypeAny, {
        status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
    }, {
        status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
    };
}, {
    params: {
        id: string;
    };
    body: {
        status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
    };
}>;
export declare const createCommentSchema: z.ZodObject<{
    body: z.ZodObject<{
        content: z.ZodString;
        taskId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        content: string;
        taskId: string;
    }, {
        content: string;
        taskId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        content: string;
        taskId: string;
    };
}, {
    body: {
        content: string;
        taskId: string;
    };
}>;
export declare const taskQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["TODO", "IN_PROGRESS", "REVIEW", "DONE"]>>;
        priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
        projectId: z.ZodOptional<z.ZodString>;
        assigneeId: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        dueDateFrom: z.ZodOptional<z.ZodString>;
        dueDateTo: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        projectId?: string | undefined;
        assigneeId?: string | undefined;
        dueDateFrom?: string | undefined;
        dueDateTo?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    }, {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        projectId?: string | undefined;
        assigneeId?: string | undefined;
        dueDateFrom?: string | undefined;
        dueDateTo?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        projectId?: string | undefined;
        assigneeId?: string | undefined;
        dueDateFrom?: string | undefined;
        dueDateTo?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    };
}, {
    query: {
        status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | undefined;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
        limit?: string | undefined;
        search?: string | undefined;
        page?: string | undefined;
        projectId?: string | undefined;
        assigneeId?: string | undefined;
        dueDateFrom?: string | undefined;
        dueDateTo?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    };
}>;
//# sourceMappingURL=core.validator.d.ts.map