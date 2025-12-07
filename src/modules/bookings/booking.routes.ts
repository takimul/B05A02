import { Router } from "express";
import { authenticate, roleGuard } from "../../middleware/auth";
import logger from "../../middleware/logger";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post(
  "/",
  logger,
  authenticate as any,
  roleGuard("customer", "admin"),
  bookingControllers.createBooking as any
);

router.get(
  "/",
  logger,
  authenticate as any,
  bookingControllers.getBookings as any
);

router.put(
  "/:bookingId",
  logger,
  authenticate as any,
  bookingControllers.updateBooking as any
);

export default router;
