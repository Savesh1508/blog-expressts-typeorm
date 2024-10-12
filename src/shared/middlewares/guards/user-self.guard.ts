import { Request, Response, NextFunction } from 'express';
import { db } from '../../../database/database';
import { ForbiddenException, NotFoundException } from '../../exceptions/http.exception';

export function userSelfGuard(entity: any, userIdField: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params['id'];
      const repo = db.connection.getRepository(entity);

      const foundResource = await repo.findOne({ where: { id: resourceId } });
      if (!foundResource) {
        throw new NotFoundException(`${entity.name} not found`);
      }

      if (req.user.id != foundResource[userIdField]) {
        throw new ForbiddenException('Access denied: Only author can do this action');
      }

      next();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        return res.status(error.status).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
}
