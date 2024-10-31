import { Response, Request } from "express";
import { envConfig } from "../config";

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: envConfig.REFRESH_MS,
    secure: true,
    httpOnly: true,
  });
};