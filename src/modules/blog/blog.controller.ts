import { CreateBlogDto } from './dto/create-blog.dto';
import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { BadRequestException, NotFoundException } from "../../shared/exceptions/http.exception";
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';

export const blogController = Router();
const blogService = new BlogService(db.connection.getRepository(Blog))

blogController.post(
  "/",
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
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const result = await blogService.getBlogById(blogId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
)

blogController.put(
  "/:id",
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
  async(req:Request, res:Response) => {
    try {
      const blogId:string = req.params["id"] as string;
      const result = await blogService.deleteBlogById(blogId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
)