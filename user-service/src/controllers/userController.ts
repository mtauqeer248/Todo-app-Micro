import { Request, Response } from "express";
import { CreateUserRequest, LoginRequest } from "../types/user.types";
import { registerUser, loginUser } from "../services/auth-services";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body as CreateUserRequest);
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if ((error as Error).message === "EMAIL_IN_USE") {
      return res.status(409).json({ error: "Email already in use" });
    }

    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await loginUser(req.body as LoginRequest);
    res.json({
      message: "Login successful",
      ...data,
    });
  } catch (error) {
    if ((error as Error).message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
