import { StatusCodes } from 'http-status-codes';
import { setRefreshTokenCookie } from './../../shared/utils/cookieUtils';
import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";
import { SignUpDto } from "../user/dto/auth-signup.dto";
import { LoginDto } from "../user/dto/auth-login.dto";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../shared/exceptions/http.exception";
import { requestHandler } from '../../shared/utils/request-handler.util';

export const authController = Router();
const authService = new AuthService(db.connection.getRepository(User))

authController.post(
  "/signup",
  requestHandler(async(req:Request, res:Response) => {
    const signUpDto: SignUpDto = req.body;
    const result = await authService.signup(signUpDto);

    setRefreshTokenCookie(res, result.refreshToken)

    return res.status(StatusCodes.CREATED).json({
      message: `User succesfully registered`,
      data: result
    });
  })
)

authController.post(
  "/login",
  requestHandler(
    async(req:Request, res:Response) => {
    const loginDto: LoginDto = req.body;
    const result = await authService.login(loginDto);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(StatusCodes.CREATED).json({
      message: `User succesfully login`,
      tokens: result
    });
  })
)