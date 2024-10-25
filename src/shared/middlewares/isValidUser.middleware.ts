import { NotFoundException, InternalServerErrorException } from './../exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../modules/user/user.entity';
import { db } from '../../database/database';

const userRepo = db.connection.getRepository(User)

export async function isValidUserMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
){
  try {
    if (req.body.userId || req.body.authorId) {
      const userId = req.body.userId || req.body.authorId;
      const user = await userRepo.findOne({where: { id: userId } });

      if (!user) {
        return next(new NotFoundException('Author not found'));
      }

      next();
    }
  } catch (error) {
    next(new InternalServerErrorException('Something went wrong'));
  }
};
