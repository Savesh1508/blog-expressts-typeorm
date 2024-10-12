import { JwtPayload } from './../../types/jwt-payload.types';
import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../utils/JwtService';
import { BadRequestException, UnauthorizedException } from '../../exceptions/http.exception';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new UnauthorizedException('User not registered')
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException('Invalid token format');
  }

  const result = jwtService.verifyAccess(token) as JwtPayload
  if (!result) {
    throw new BadRequestException("Invalid or expired token");
  }

  req.user = result
  next()
}
