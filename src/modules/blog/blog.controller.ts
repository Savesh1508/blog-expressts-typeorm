import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { blogRouteParamsDtoSchema } from './dto/route-params-blog.dto';
import { CreateBlogDto, blogCreateDtoSchema } from './dto/create-blog.dto';
import { blogUpdateDtoSchema, UpdateBlogDto } from './dto/update-blog.dto';
import { BadRequestException, NotFoundException } from "../../shared/exceptions/http.exception";
import { Blog } from './blog.entity';
import { User } from '../user/user.entity';
import { BlogService } from './blog.service';
import { CommentService } from '../comments/comments.service';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { commentCreateDtoSchema, CreateCommentDto } from "../comments/dto/create-comment.dto";
import { Comment } from "../comments/comments.entity";

export const blogController = Router();

const blogService = new BlogService(
  db.connection.getRepository(Blog),
  db.connection.getRepository(User)
)
const commentService = new CommentService(
  db.connection.getRepository(Comment),
  db.connection.getRepository(User),
  db.connection.getRepository(Blog)
)

blogController.post(
  "/",
  validateRequestBody(blogCreateDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const createBlogDto: CreateBlogDto = req.body;
      const result = await blogService.createBlog(createBlogDto);

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)

blogController.get(
  "/",
  async(req:Request, res:Response) => {
    try {
      const result = await blogService.getAllBlogs();

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
)

blogController.get(
  "/:id",
  validateRequestParams(blogRouteParamsDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const result = await blogService.getBlogById(blogId);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)

blogController.put(
  "/:id",
  validateRequestParams(blogRouteParamsDtoSchema),
  validateRequestBody(blogUpdateDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const updateBlogDto: UpdateBlogDto = req.body;
      const result = await blogService.updateBlogById(blogId, updateBlogDto);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)

blogController.delete(
  "/:id",
  validateRequestParams(blogRouteParamsDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const result = await blogService.deleteBlogById(blogId);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)

blogController.post(
  "/:id/comments",
  validateRequestParams(blogRouteParamsDtoSchema),
  validateRequestBody(commentCreateDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const createCommentDto: CreateCommentDto = req.body;
      const result = await commentService.createComment(blogId, createCommentDto);

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)

blogController.get(
  "/:id/comments",
  validateRequestParams(blogRouteParamsDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const result = await commentService.getBlogComments(blogId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
)