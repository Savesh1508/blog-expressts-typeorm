import { Router, Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { User } from '../user/user.entity';
import { db } from '../../database/database';
import { AuthService } from './auth.service';

const userRepository = db.connection.getRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post('/signup', (req:Request, res:Response) => authController.signup.bind(req, res));
authRouter.post('/login', (req:Request, res:Response) => authController.login.bind(req, res));

export default authRouter;
