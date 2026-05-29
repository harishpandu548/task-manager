export class ApiError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(statusCode, message, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message = 'Bad Request', details) {
        return new ApiError(400, message, true, details);
    }
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }
    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }
    static notFound(message = 'Not Found') {
        return new ApiError(404, message);
    }
    static conflict(message = 'Conflict') {
        return new ApiError(409, message);
    }
    static internal(message = 'Internal Server Error') {
        return new ApiError(500, message, false);
    }
    static tooManyRequests(message = 'Too Many Requests') {
        return new ApiError(429, message);
    }
}
//# sourceMappingURL=ApiError.js.map