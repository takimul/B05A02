import { Router } from "express";
import { authenticate, roleGuard } from "../../middleware/auth";
import logger from "../../middleware/logger";
import { userControllers } from "./user.controller";

const router = Router();

router.get(
  "/",
  logger,
  authenticate,
  roleGuard("admin"),
  userControllers.getAllUsers
);

router.put("/:userId", logger, authenticate, userControllers.updateUser);

router.delete(
  "/:userId",
  logger,
  authenticate,
  roleGuard("admin"),
  userControllers.deleteUser
);

export default router;
