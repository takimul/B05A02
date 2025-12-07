import { Router } from "express";
import { authenticate, roleGuard } from "../../middleware/auth";
import logger from "../../middleware/logger";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post(
  "/",
  logger,
  authenticate as any,
  roleGuard("admin"),
  vehicleControllers.createVehicle
);
router.get("/", logger, vehicleControllers.getAllVehicles);
router.get("/:vehicleId", logger, vehicleControllers.getVehicleById);
router.put(
  "/:vehicleId",
  logger,
  authenticate as any,
  roleGuard("admin"),
  vehicleControllers.updateVehicle
);
router.delete(
  "/:vehicleId",
  logger,
  authenticate as any,
  roleGuard("admin"),
  vehicleControllers.deleteVehicle
);

export default router;
