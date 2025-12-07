"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const vehicle_service_1 = require("./vehicle.service");
const createVehicle = async (req, res) => {
    try {
        const v = await vehicle_service_1.vehicleServices.createVehicle(req.body);
        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: v,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
const getAllVehicles = async (_req, res) => {
    try {
        const rows = await vehicle_service_1.vehicleServices.getAllVehicles();
        if (rows.length === 0)
            return res
                .status(200)
                .json({ success: true, message: "No vehicles found", data: [] });
        return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: rows,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
const getVehicleById = async (req, res) => {
    try {
        const id = Number(req.params.vehicleId);
        const v = await vehicle_service_1.vehicleServices.getVehicleById(id);
        if (!v)
            return res
                .status(404)
                .json({ success: false, message: "Vehicle not found" });
        return res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: v,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateVehicle = async (req, res) => {
    try {
        const id = Number(req.params.vehicleId);
        const updated = await vehicle_service_1.vehicleServices.updateVehicle(id, req.body);
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: "Vehicle not found" });
        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: updated,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
const deleteVehicle = async (req, res) => {
    try {
        const id = Number(req.params.vehicleId);
        const deleted = await vehicle_service_1.vehicleServices.deleteVehicle(id);
        if (!deleted)
            return res.status(400).json({
                success: false,
                message: "Cannot delete vehicle with active bookings or vehicle not found",
            });
        return res
            .status(200)
            .json({ success: true, message: "Vehicle deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.vehicleControllers = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
