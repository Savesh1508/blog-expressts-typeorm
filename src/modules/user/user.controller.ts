import { ChangePasswordDto } from './dto/change-password.dto';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import { Router, Request, Response } from "express";
import { authGuard } from "../../shared/middlewares/guards/auth.guard";
import { requestHandler } from "../../shared/utils/request-handler.util";
import { db } from '../../database/database';
import { User } from './user.entity';
import { validateRequestBody } from '../../shared/validators/request-body.validator';
import { UpdateUserDto } from './dto/update-user.dto';
import { adminGuard } from '../../shared/middlewares/guards/admin.guard';
import { validateRequestParams } from '../../shared/validators/request-params.validator';
import { UserRouteParamsDto } from './dto/route-params-comments.dto';

const userService = new UserService(db.connection.getRepository(User))

export const userController = Router()

userController.get(
  '/profile',
  authGuard,
  requestHandler(async(req: Request, res: Response) => {
    const userId:string = req.user.id;
    const userProfile = await userService.getUserProfile(userId)

    return res.status(StatusCodes.OK).json({
      message: 'User profile successfully received',
      data: userProfile
    })
  })
)

userController.put(
  '/profile/change-password',
  authGuard,
  validateRequestBody(ChangePasswordDto),
  requestHandler(async(req: Request, res: Response) => {
    const userId:string = req.user.id;
    const changePasswordDto: ChangePasswordDto = req.body;
    const changedUser = await userService.changePassword(userId, changePasswordDto)

    return res.status(StatusCodes.OK).json({
      message: 'User password successfully changed',
      data: changedUser
    })
  })
)

userController.put(
  '/profile',
  authGuard,
  validateRequestBody(UpdateUserDto),
  requestHandler(async(req: Request, res: Response) => {
    const userId:string = req.user.id;
    const updateUserDto: UpdateUserDto = req.body;
    const updatedUser = await userService.updateUserProfile(userId, updateUserDto)

    return res.status(StatusCodes.OK).json({
      message: 'User successfully updated',
      data: updatedUser
    })
  })
)

userController.put(
  '/:id/role',
  authGuard,
  adminGuard,
  validateRequestParams(UserRouteParamsDto),
  requestHandler(async(req: Request, res: Response) => {
    const userId = req.params["id"] as string
    const updatedUser = await userService.updateUserRole(userId)

    return res.status(StatusCodes.OK).json({
      message: 'User role successfully updated',
      data: updatedUser
    })
  })
)