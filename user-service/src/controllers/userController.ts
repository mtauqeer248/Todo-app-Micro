import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { CreateUserRequest, LoginRequest } from "../types/user.types";


export  const  register = async(req: Request, res: Response)=> {
    try {
      const { email, password }: CreateUserRequest = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already in use" });
      }

     
      const password_hash = await hashPassword(password);
      const user = await UserModel.create({
        email,
        password_hash,
        password: "",
      });

      const { password_hash: _, ...userResponse } = user;
      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

 export  const login=  async(req: Request, res: Response)=> {
    try {
      const { email, password }: LoginRequest = req.body;
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await comparePassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({
        uuid: user.uuid,
        email: user.email,
      });

      res.json({
        message: "Login successful",
        token,
        user: {
          uuid: user.uuid,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

