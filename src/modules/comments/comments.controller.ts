import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { commentRouteParamsDtoSchema } from './dto/route-params-comments.dto';
import { commentUpdateDtoSchema, UpdateCommentDto } from './dto/update-comment.dto';
import { BadRequestException, NotFoundException } from "../../shared/exceptions/http.exception";
import { Comment } from './comments.entity';
import { User } from '../user/user.entity';
import { CommentService } from './comments.service';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { Blog } from "../blog/blog.entity";

export const commentController = Router();
const commentService = new CommentService(
  db.connection.getRepository(Comment),
  db.connection.getRepository(User),
  db.connection.getRepository(Blog)
)

commentController.put(
  "/:id",
  validateRequestParams(commentRouteParamsDtoSchema),
  validateRequestBody(commentUpdateDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const commentId:string = req.params["id"] as string;
      const updateCommentDto: UpdateCommentDto = req.body;
      const result = await commentService.updateCommentById(commentId, updateCommentDto);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)

commentController.delete(
  "/:id",
  validateRequestParams(commentRouteParamsDtoSchema),
  async(req:Request, res:Response) => {
    try {
      const commentId:string = req.params["id"] as string;
      const result = await commentService.deleteCommentById(commentId);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
  }
)