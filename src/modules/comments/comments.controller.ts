import { StatusCodes } from 'http-status-codes';
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
import { requestHandler } from "../../shared/utils/request-handler.util";

export const commentController = Router();
const commentService = new CommentService(
  db.connection.getRepository(Comment),
  db.connection.getRepository(Blog)
)

commentController.put(
  "/:id",
  validateRequestParams(commentRouteParamsDtoSchema),
  validateRequestBody(commentUpdateDtoSchema),
  requestHandler(async(req:Request, res:Response) => {
    const commentId:string = req.params["id"] as string;
    const updateCommentDto: UpdateCommentDto = req.body;
    const result = await commentService.updateCommentById(commentId, updateCommentDto);

    return res.status(StatusCodes.OK).json({
      message: `Comment succesfully updated`,
      data: result
    });
  })
)

commentController.delete(
  "/:id",
  validateRequestParams(commentRouteParamsDtoSchema),
  requestHandler(async(req:Request, res:Response) => {
    const commentId:string = req.params["id"] as string;
    const result = await commentService.deleteCommentById(commentId);

    return res.status(StatusCodes.OK).json({
      message: `Comment succesfully deleted`,
      data: result
    });
  })
)