import { ApiError } from '../utils/ApiError.js';
export const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(ApiError.unauthorized('Authentication required'));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`));
            return;
        }
        next();
    };
};
//# sourceMappingURL=role.middleware.js.map