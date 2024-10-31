import { Like } from './../likes/likes.entity';
import { StatusCodes } from 'http-status-codes';
import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { Comment } from './comments.entity';
import { CommentService } from './comments.service';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { requestHandler } from "../../shared/utils/request-handler.util";
import { authGuard } from '../../shared/middlewares/guards/auth.guard';
import { userSelfGuard } from '../../shared/middlewares/guards/user-self.guard';
import { userSelfOrAdminGuard } from '../../shared/middlewares/guards/user-self-or-admin.guard';
import { CommentRouteParamsDto } from './dto/route-params-comments.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

export const commentController = Router();
const commentService = new CommentService(
  db.connection.getRepository(Comment),
  db.connection.getRepository(Like)
)

commentController.put(
  "/:id",
  authGuard,
  validateRequestParams(CommentRouteParamsDto),
  validateRequestBody(UpdateCommentDto),
  userSelfGuard(Comment, 'userId'),
  requestHandler(async(req:Request, res:Response) => {
    const commentId = req.params["id"] as string;
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
  validateRequestParams(CommentRouteParamsDto),
  userSelfOrAdminGuard(Comment, 'userId'),
  requestHandler(async(req:Request, res:Response) => {
    const commentId = req.params["id"] as string;
    const result = await commentService.deleteCommentById(commentId);

    return res.status(StatusCodes.OK).json({
      message: `Comment succesfully deleted`,
      data: result
    });
  })
)

commentController.post(
  "/:id/like",
  authGuard,
  validateRequestParams(CommentRouteParamsDto),
  requestHandler(async(req:Request, res:Response) => {
    const userId = req.user.id
    const commentId = req.params["id"] as string;
    const result = await commentService.toggleCommentLike(commentId, userId)

    return res.status(StatusCodes.OK).json({
      data: result
    });
  })
)