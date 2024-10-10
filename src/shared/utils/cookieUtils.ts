import { Response, Request } from "express";
import dotenv from "dotenv";
dotenv.config();

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: Number(process.env["REFRESH_MS"]),
    secure: true,
    httpOnly: true,
  });
};