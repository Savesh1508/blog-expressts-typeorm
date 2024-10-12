import { StatusCodes } from 'http-status-codes';
import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { commentRouteParamsDtoSchema } from './dto/route-params-comments.dto';
import { commentUpdateDtoSchema, UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comments.entity';
import { CommentService } from './comments.service';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { requestHandler } from "../../shared/utils/request-handler.util";
import { authGuard } from '../../shared/middlewares/guards/auth.guard';
import { userSelfGuard } from '../../shared/middlewares/guards/user-self.guard';
import { userSelfOrAdminGuard } from '../../shared/middlewares/guards/user-self-or-admin.guard';

export const commentController = Router();
const commentService = new CommentService(db.connection.getRepository(Comment))

commentController.put(
  "/:id",
  authGuard,
  userSelfGuard(Comment, 'userId'),
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
  authGuard,
  userSelfOrAdminGuard(Comment, 'userId'),
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