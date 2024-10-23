import { JwtPayload } from '../../utils/JwtService';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
