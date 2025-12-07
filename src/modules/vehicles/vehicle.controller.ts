import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const v = await vehicleServices.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: v,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const rows = await vehicleServices.getAllVehicles();
    if (rows.length === 0)
      return res
        .status(200)
        .json({ success: true, message: "No vehicles found", data: [] });
    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: rows,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const v = await vehicleServices.getVehicleById(id);
    if (!v)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: v,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const updated = await vehicleServices.updateVehicle(id, req.body);
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const deleted = await vehicleServices.deleteVehicle(id);
    if (!deleted)
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete vehicle with active bookings or vehicle not found",
      });
    return res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
