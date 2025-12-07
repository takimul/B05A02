import app from "./app";
import config from "./config";
import { pool } from "./config/db";
import { bookingServices } from "./modules/bookings/booking.service";

const PORT = Number(config.port || 5000);

const start = async () => {
  try {
    await pool.connect();
    console.log("Database is connected");

    const count = await bookingServices.autoReturnExpiredBookings();
    if (count > 0)
      console.log(`✅ Auto-returned ${count} expired bookings on startup`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

start();
