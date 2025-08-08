import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/user.types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.trim() === "") {
  throw new Error("JWT_SECRET environment variable is not defined or is empty");
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload as any, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
