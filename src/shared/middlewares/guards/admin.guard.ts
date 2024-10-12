import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../../exceptions/http.exception';
import { Roles } from '../../types/user-roles.types';

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  if (req.user.role != Roles.ADMIN) {
    throw new ForbiddenException("Access denied");
  }

  next()
}
