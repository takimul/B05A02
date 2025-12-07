import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import vehicleRoutes from "./modules/vehicles/vehicle.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import initDB from "./config/db";

initDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (_req, res) => res.send("Welcome to  Vehicle Rental API server "));

export default app;
