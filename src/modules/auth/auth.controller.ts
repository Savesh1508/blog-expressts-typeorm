import { Router, Request, Response } from "express";
import { db } from "../../database/database";
import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/auth-signup.dto";
import { LoginDto } from "./dto/auth-login.dto";

export const authController = Router();
const authService = new AuthService(db.connection.getRepository(User))

authController.post(
  "/signup",
  async(req:Request, res:Response) => {
    try {
      const signUpDto: SignUpDto = req.body;

      const result = await authService.signup(signUpDto);
      if (typeof result === 'string') {
        return res.status(400).json({ message: result });
      }
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
})

authController.post(
  "/login",
  async(req:Request, res:Response) => {
    try {
      const loginDto: LoginDto = req.body;

      const result = await authService.login(loginDto);
      if (typeof result === 'string') {
        return res.status(400).json({ message: result });
      }
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
})