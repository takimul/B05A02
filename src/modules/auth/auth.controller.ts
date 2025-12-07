import { Request, Response } from "express";
import { authServices } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: "name, email, password and phone are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: "password must be at least 6 characters",
      });
    }

    const user = await authServices.createUser({
      name,
      email,
      password,
      phone,
      role: role ?? "customer",
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: "email already exists",
      });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: "email and password are required",
      });
    }
    const { user, token } = await authServices.authenticateUser(
      email,
      password
    );
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token, user },
    });
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: "Invalid email or password",
      });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: err.message,
    });
  }
};
