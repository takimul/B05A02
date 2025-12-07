"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const db_1 = require("./config/db");
const booking_service_1 = require("./modules/bookings/booking.service");
const PORT = Number(config_1.default.port || 5000);
const start = async () => {
    try {
        await db_1.pool.connect();
        console.log("Database is connected");
        const count = await booking_service_1.bookingServices.autoReturnExpiredBookings();
        if (count > 0)
            console.log(`✅ Auto-returned ${count} expired bookings on startup`);
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
};
start();
