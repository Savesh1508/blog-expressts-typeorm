import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { blogRouteParamsDtoSchema } from './dto/route-params-blog.dto';
import { CreateBlogDto, blogCreateDtoSchema } from './dto/create-blog.dto';
import { blogUpdateDtoSchema, UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { CommentService } from '../comments/comments.service';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { commentCreateDtoSchema, CreateCommentDto } from "../comments/dto/create-comment.dto";
import { Comment } from "../comments/comments.entity";
import { requestHandler } from "../../shared/utils/request-handler.util";
import { StatusCodes } from "http-status-codes";
import { isValidUserMiddleware } from "../../shared/middlewares/isValidUser.middleware";
import { isValidBlogMiddleware } from "../../shared/middlewares/isValidBlog.middleware";
import { authGuard } from "../../shared/middlewares/guards/auth.guard";
import { userSelfGuard } from "../../shared/middlewares/guards/user-self.guard";
import { adminGuard } from "../../shared/middlewares/guards/admin.guard";
import { userSelfOrAdminGuard } from "../../shared/middlewares/guards/user-self-or-admin.guard";


export const blogController = Router();

const blogService = new BlogService(db.connection.getRepository(Blog))
const commentService = new CommentService(db.connection.getRepository(Comment))

blogController.post(
  "/",
  authGuard,
  validateRequestBody(blogCreateDtoSchema),
  isValidUserMiddleware,
  requestHandler(async(req:Request, res:Response) => {
    const createBlogDto: CreateBlogDto = req.body;
    const result = await blogService.createBlog(createBlogDto);

    return res.status(StatusCodes.CREATED).json({
      message: `Blog succesfully created`,
      data: result
    });
  })
)

blogController.get(
  "/",
  requestHandler(async(req:Request, res:Response) => {
    const result = await blogService.getAllBlogs();

    return res.status(StatusCodes.OK).json({
      message: `Blogs succesfully received`,
      data: result
    });
  })
)

blogController.get(
  "/:id",
  validateRequestParams(blogRouteParamsDtoSchema),
  requestHandler(async(req:Request, res:Response) => {
    const blogId:string = req.params["id"] as string;
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
  userSelfGuard(Blog, 'authorId'),
  validateRequestParams(blogRouteParamsDtoSchema),
  validateRequestBody(blogUpdateDtoSchema),
  requestHandler(async(req:Request, res:Response) => {
    const blogId:string = req.params["id"] as string;
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
  userSelfOrAdminGuard(Blog, 'authorId'),
  validateRequestParams(blogRouteParamsDtoSchema),
  requestHandler(async(req:Request, res:Response) => {
    const blogId:string = req.params["id"] as string;
    const result = await blogService.deleteBlogById(blogId);

    return res.status(StatusCodes.OK).json({
      message: `Blog succesfully deleted`,
      data: result
    });
  })
)

blogController.post(
  "/:id/comments",
  validateRequestParams(blogRouteParamsDtoSchema),
  validateRequestBody(commentCreateDtoSchema),
  isValidUserMiddleware,
  isValidBlogMiddleware,
  requestHandler(async(req:Request, res:Response) => {
    const blogId:string = req.params["id"] as string;
    const createCommentDto: CreateCommentDto = req.body;
    const result = await commentService.createComment(blogId, createCommentDto);

    return res.status(StatusCodes.CREATED).json({
      message: `Comment succesfully created`,
      data: result
    });
  })
)

blogController.get(
  "/:id/comments",
  validateRequestParams(blogRouteParamsDtoSchema),
  isValidBlogMiddleware,
  requestHandler(async(req:Request, res:Response) => {
    const blogId:string = req.params["id"] as string;
    const result = await commentService.getBlogComments(blogId);

    return res.status(StatusCodes.OK).json({
      message: `Comments succesfully received`,
      data: result
    });
  })
)