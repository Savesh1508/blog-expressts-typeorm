import { NotFoundException, InternalServerErrorException } from './../exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
import { Blog } from '../../modules/blog/blog.entity';
import { db } from '../../database/database';

const blogRepo = db.connection.getRepository(Blog)

export async function isValidBlogMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
){
  try {
    if (!req.params['id']) {
      return next(new NotFoundException('Blog not found'));
    }

    const blogId = req.params['id'];
    const blog = await blogRepo.findOne({where: { id: blogId } });
    if (!blog) {
      return next(new NotFoundException('Blog not found'));
    }

    next();
  } catch (error) {
    next(new InternalServerErrorException('Something went wrong'));
  }
};
