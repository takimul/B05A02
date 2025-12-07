import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: "Missing token",
      });
    }

    const token = header.split(" ")[1];
    const payload = verifyToken(token as string) as any;

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      errors: "Invalid or expired token",
    });
  }
};

export const roleGuard = (...allowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Insufficient permissions",
      });
    }

    next();
  };
};
