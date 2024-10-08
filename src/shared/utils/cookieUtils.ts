import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: Number(process.env["REFRESH_MS"]),
    httpOnly: true,
  });
};