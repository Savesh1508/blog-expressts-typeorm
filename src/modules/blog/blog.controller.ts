import { CreateCommentDto } from './../comments/dto/create-comment.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogRouteParamsDto } from './dto/route-params-blog.dto';
import { GetBlogsQueryDto, } from './dto/get-blog-query.dto';
import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { CommentService } from '../comments/comments.service';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { Comment } from "../comments/comments.entity";
import { requestHandler } from "../../shared/utils/request-handler.util";
import { StatusCodes } from "http-status-codes";
import { validateRequestQuery } from '../../shared/validators/request-query.validator';
import { isValidUserMiddleware } from "../../shared/middlewares/isValidUser.middleware";
import { isValidBlogMiddleware } from "../../shared/middlewares/isValidBlog.middleware";
import { authGuard } from "../../shared/middlewares/guards/auth.guard";
import { userSelfGuard } from "../../shared/middlewares/guards/user-self.guard";
import { userSelfOrAdminGuard } from "../../shared/middlewares/guards/user-self-or-admin.guard";
import { Like } from '../likes/likes.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CommentRouteParamsDto } from '../comments/dto/route-params-comments.dto';

export const blogController = Router();

const blogService = new BlogService(
  db.connection.getRepository(Blog),
  db.connection.getRepository(Like)
)

const commentService = new CommentService(
  db.connection.getRepository(Comment),
  db.connection.getRepository(Like),
)

blogController.post(
  "/",
  authGuard,
  validateRequestBody(CreateBlogDto),
  isValidUserMiddleware,
  requestHandler(async(req:Request, res:Response) => {
    const userId = req.user.id
    const createBlogDto: CreateBlogDto = req.body;
    const result = await blogService.createBlog(userId, createBlogDto);

    return res.status(StatusCodes.CREATED).json({
      message: `Blog succesfully created`,
      data: result
    });
  })
)

blogController.get(
  "/",
  validateRequestQuery(GetBlogsQueryDto),
  requestHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as GetBlogsQueryDto
    const result = await blogService.getAllBlogs(query);

    return res.status(StatusCodes.OK).json({
      message: `Blogs succesfully received`,
      data: result.blogs,
      pages: result.pages,
      total: result.total,
    });
  })
)

blogController.get(
  "/:id",
  validateRequestParams(BlogRouteParamsDto),
  requestHandler(async (req: Request, res: Response) => {
    const blogId = req.params["id"] as string;
    const result = await blogService.getBlogById(blogId);

    return res.status(StatusCodes.OK).json({
      message: `Blog succesfully received`,
      data: result
    });
  })
)

blogController.put(
  "/:id",
  authGuard,
  validateRequestParams(BlogRouteParamsDto),
  validateRequestBody(UpdateBlogDto),
  userSelfGuard(Blog, 'authorId'),
  requestHandler(async (req: Request, res: Response) => {
    const blogId = req.params["id"] as string;
    const updateBlogDto: UpdateBlogDto = req.body;
    const result = await blogService.updateBlogById(blogId, updateBlogDto);

    return res.status(StatusCodes.OK).json({
      message: `Blog succesfully updated`,
      data: result
    });
  })
)

blogController.delete(
  "/:id",
  authGuard,
  validateRequestParams(BlogRouteParamsDto),
  userSelfOrAdminGuard(Blog, 'authorId'),
  requestHandler(async (req: Request, res: Response) => {
    const blogId = req.params["id"] as string;
    const result = await blogService.deleteBlogById(blogId);

    return res.status(StatusCodes.OK).json({
      message: `Blog succesfully deleted`,
      data: result
    });
  })
)

blogController.post(
  "/:id/like",
  authGuard,
  validateRequestParams(BlogRouteParamsDto),
  requestHandler(async(req:Request, res:Response) => {
    const userId = req.user.id
    const blogId = req.params["id"] as string;
    const result = await blogService.toggleBlogLike(blogId, userId)

    return res.status(StatusCodes.OK).json({
      data: result
    });
  })
)

blogController.post(
  "/:id/comments",
  authGuard,
  validateRequestParams(BlogRouteParamsDto),
  validateRequestBody(CreateCommentDto),
  isValidUserMiddleware,
  isValidBlogMiddleware,
  requestHandler(async(req:Request, res:Response) => {
    const userId = req.user.id
    const blogId = req.params["id"] as string;
    const createCommentDto: CreateCommentDto = req.body;
    const result = await commentService.createComment(userId, blogId, createCommentDto);

    return res.status(StatusCodes.CREATED).json({
      message: `Comment succesfully created`,
      data: result
    });
  })
)

blogController.get(
  "/:id/comments",
  validateRequestParams(CommentRouteParamsDto),
  isValidBlogMiddleware,
  requestHandler(async(req:Request, res:Response) => {
    const blogId = req.params["id"] as string;
    const result = await commentService.getBlogComments(blogId);

    return res.status(StatusCodes.OK).json({
      message: `Comments succesfully received`,
      data: result
    });
  })
)