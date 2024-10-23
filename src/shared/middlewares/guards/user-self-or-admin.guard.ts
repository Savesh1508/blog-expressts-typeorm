import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { db } from '../../../database/database';
import { ForbiddenException, NotFoundException } from '../../exceptions/http.exception';
import { Roles } from '../../types/user-roles.types';
import { userSelfGuard } from './user-self.guard';

export function userSelfOrAdminGuard(entity: any, userIdField: string) {
  const selfGuard = userSelfGuard(entity, userIdField);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user.role === Roles.ADMIN) {
        return next();
      }

      await selfGuard(req, res, next);
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: 'Access denied: Only author or admin can delete',
        });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
      });
    }
  };
}