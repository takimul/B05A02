"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.userServices.getAllUsers();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateUser = async (req, res) => {
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
        const updated = await user_service_1.userServices.updateUser(userId, req.body);
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const deleted = await user_service_1.userServices.deleteUser(userId);
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.userControllers = {
    getAllUsers,
    updateUser,
    deleteUser,
};
