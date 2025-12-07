"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const logger_1 = __importDefault(require("../../middleware/logger"));
const booking_controller_1 = require("./booking.controller");
const router = (0, express_1.Router)();
router.post("/", logger_1.default, auth_1.authenticate, (0, auth_1.roleGuard)("customer", "admin"), booking_controller_1.bookingControllers.createBooking);
router.get("/", logger_1.default, auth_1.authenticate, booking_controller_1.bookingControllers.getBookings);
router.put("/:bookingId", logger_1.default, auth_1.authenticate, booking_controller_1.bookingControllers.updateBooking);
exports.default = router;
