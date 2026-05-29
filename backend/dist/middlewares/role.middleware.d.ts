import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export declare const authorize: (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map