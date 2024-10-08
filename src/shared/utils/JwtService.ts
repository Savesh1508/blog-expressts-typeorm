import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

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
      console.log("Invalid access token:", error);
      return null;
    }
  }

  verifyRefresh(token: string) {
    try {
      return jwt.verify(token, this.refreshKey);
    } catch (error) {
      console.log("Invalid refresh token:", error);
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
  process.env["ACCESS_KEY"] || "",
  process.env["REFRESH_KEY"] || "",
  process.env["ACCESS_TIME"] || "",
  process.env["REFRESH_TIME"] || ""
)