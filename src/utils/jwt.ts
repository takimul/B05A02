import jwt from "jsonwebtoken";
import config from "../config";

export function signToken(payload: Record<string, any>) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.jwtSecret);
}
