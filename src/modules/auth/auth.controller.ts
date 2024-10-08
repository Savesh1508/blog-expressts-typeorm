import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";
import { SignUpDto } from "../user/dto/auth-signup.dto";
import { LoginDto } from "../user/dto/auth-login.dto";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../shared/exceptions/http.exception";

export const authController = Router();
const authService = new AuthService(db.connection.getRepository(User))

authController.post(
  "/signup",
  async(req:Request, res:Response) => {
    try {
      const signUpDto: SignUpDto = req.body;
      const result = await authService.signup(signUpDto);

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
})

authController.post(
  "/login",
  async(req:Request, res:Response) => {
    try {
      const loginDto: LoginDto = req.body;
      const result = await authService.login(loginDto);

      return res.status(200).json(result);
    } catch (error)  {
      if (error instanceof NotFoundException) {
        return res.status(400).json({ message: error.message });
      }
      if (error instanceof UnauthorizedException) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error });
    }
})