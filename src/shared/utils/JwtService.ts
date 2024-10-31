import jwt from "jsonwebtoken"
import { envConfig } from "../config/env.config";
import { JwtPayload } from "../types/jwt-payload.types";

class JwtService {
  constructor(
    private accessKey:string,
    private refreshKey:string,
    private accessTime:string,
    private refreshTime:string
  ){
    if (!this.accessKey || !this.refreshKey || !this.accessTime || !this.refreshTime) {
      throw new Error("Environment variables are missing!");
    }
  }

  verifyAccess(token: string) {
    try {
      return jwt.verify(token, this.accessKey);
    } catch (error) {
      return null;
    }
  }

  verifyRefresh(token: string) {
    try {
      return jwt.verify(token, this.refreshKey);
    } catch (error) {
      return null;
    }
  }

  generateTokens(payload: object) {
    const accessToken = jwt.sign(payload, this.accessKey, { expiresIn: this.accessTime });
    const refreshToken = jwt.sign(payload, this.refreshKey, { expiresIn: this.refreshTime });

    return {
      accessToken,
      refreshToken
    };
  }
}

export const jwtService = new JwtService(
  envConfig.ACCESS_KEY,
  envConfig.REFRESH_KEY,
  envConfig.ACCESS_TIME,
  envConfig.REFRESH_TIME,
)