import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWTPayload } from "../types/todo.types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const actualToken = token.replace(/^Bearer\s+/i, "");
    const decoded = jwt.verify(
      actualToken,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const refreshToken = (payload: JWTPayload): string => {
  const { iat, exp, iss, aud, ...cleanPayload } = payload as any;
  return generateToken(cleanPayload as JWTPayload);
};
