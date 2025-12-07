"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingControllers = void 0;
const booking_service_1 = require("./booking.service");
const createBooking = async (req, res) => {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const requester = req.user;
        if (requester.role !== "admin" && requester.id !== Number(customer_id)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                errors: "Customers can only create bookings for themselves",
            });
        }
        const booking = await booking_service_1.bookingServices.createBooking({
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
        });
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err.message === "VEHICLE_NOT_AVAILABLE") {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err.message === "INVALID_DATES") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: "rent_end_date must be after rent_start_date",
            });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};
const getBookings = async (req, res) => {
    try {
        const requester = req.user;
        const bookings = await booking_service_1.bookingServices.getBookings(requester);
        const message = requester.role === "admin"
            ? "Bookings retrieved successfully"
            : "Your bookings retrieved successfully";
        return res.status(200).json({
            success: true,
            message,
            data: bookings,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
const updateBooking = async (req, res) => {
    try {
        const requester = req.user;
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;
        if (!["cancelled", "returned"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }
        const updated = await booking_service_1.bookingServices.updateBooking(bookingId, status, requester);
        if (!updated) {
            return res.status(400).json({
                success: false,
                message: "Cannot update booking (rule violation or not found)",
            });
        }
        const message = status === "cancelled"
            ? "Booking cancelled successfully"
            : "Booking marked as returned. Vehicle is now available";
        return res.status(200).json({
            success: true,
            message,
            data: updated,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.bookingControllers = {
    createBooking,
    getBookings,
    updateBooking,
};
