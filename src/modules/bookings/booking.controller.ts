import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    const requester = req.user!;

    if (requester.role !== "admin" && requester.id !== Number(customer_id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Customers can only create bookings for themselves",
      });
    }

    const booking = await bookingServices.createBooking({
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
  } catch (err: any) {
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

const getBookings = async (req: Request, res: Response) => {
  try {
    const requester = req.user!;
    const bookings = await bookingServices.getBookings(requester);

    const message =
      requester.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    return res.status(200).json({
      success: true,
      message,
      data: bookings,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const requester = req.user!;
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;

    if (!["cancelled", "returned"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updated = await bookingServices.updateBooking(
      bookingId,
      status,
      requester
    );

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Cannot update booking (rule violation or not found)",
      });
    }

    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    return res.status(200).json({
      success: true,
      message,
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
