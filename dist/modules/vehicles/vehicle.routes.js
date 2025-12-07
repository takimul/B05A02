"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const logger_1 = __importDefault(require("../../middleware/logger"));
const vehicle_controller_1 = require("./vehicle.controller");
const router = (0, express_1.Router)();
router.post("/", logger_1.default, auth_1.authenticate, (0, auth_1.roleGuard)("admin"), vehicle_controller_1.vehicleControllers.createVehicle);
router.get("/", logger_1.default, vehicle_controller_1.vehicleControllers.getAllVehicles);
router.get("/:vehicleId", logger_1.default, vehicle_controller_1.vehicleControllers.getVehicleById);
router.put("/:vehicleId", logger_1.default, auth_1.authenticate, (0, auth_1.roleGuard)("admin"), vehicle_controller_1.vehicleControllers.updateVehicle);
router.delete("/:vehicleId", logger_1.default, auth_1.authenticate, (0, auth_1.roleGuard)("admin"), vehicle_controller_1.vehicleControllers.deleteVehicle);
exports.default = router;
