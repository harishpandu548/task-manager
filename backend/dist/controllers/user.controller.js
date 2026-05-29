import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';
export const userController = {
    getAll: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = await userService.getAll(page, limit);
        res.json({ success: true, data });
    }),
    getById: asyncHandler(async (req, res) => {
        const data = await userService.getById(String(req.params.id));
        res.json({ success: true, data });
    }),
    create: asyncHandler(async (req, res) => {
        const data = await userService.create(req.body);
        res.status(201).json({ success: true, data });
    }),
    update: asyncHandler(async (req, res) => {
        const data = await userService.update(String(req.params.id), req.body);
        res.json({ success: true, data });
    }),
    delete: asyncHandler(async (req, res) => {
        await userService.delete(String(req.params.id));
        res.json({ success: true, message: 'User deactivated' });
    }),
};
//# sourceMappingURL=user.controller.js.map