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
    if (!req.user.id) {
      return next(new NotFoundException('Author not found'));
    }

    const userId = req.user.id;
    const user = await userRepo.findOne({where: { id: userId } });
    if (!user) {
      return next(new NotFoundException('Author not found'));
    }

    next();
  } catch (error) {
    return next(new InternalServerErrorException('Something went wrong'));
  }
};
