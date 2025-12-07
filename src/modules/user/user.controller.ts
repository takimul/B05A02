import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Can only update your own profile",
      });
    }

    const updated = await userServices.updateUser(userId, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const deleted = await userServices.deleteUser(userId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active bookings or user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
