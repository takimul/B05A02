import "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        email: string;
        role: string;
        name?: string;
      };
    }
  }
}

export {};
