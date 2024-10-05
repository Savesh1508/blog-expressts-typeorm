import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth-signup.dto';
import { LoginDto } from './dto/auth-login.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signup(req: Request, res: Response){
    try {
      const signUpDto: SignUpDto = req.body;

      const result = await this.authService.signup(signUpDto);
      if (typeof result === 'string') {
        return res.status(400).json({ message: result });
      }
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async login(req: Request, res: Response){
    try {
      const loginDto: LoginDto = req.body;

      const result = await this.authService.login(loginDto);
      if (typeof result === 'string') {
        return res.status(400).json({ message: result });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error});
    }
  }
}
