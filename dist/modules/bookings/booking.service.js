"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const db_1 = require("../../config/db");
function daysBetween(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((end.getTime() - start.getTime()) / msPerDay);
}
async function createBooking(payload) {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        throw new Error("INVALID_DATES");
    }
    const vehicleQ = await db_1.pool.query(`
    SELECT id, vehicle_name, daily_rent_price, availability_status 
    FROM vehicles 
    WHERE id=$1
    LIMIT 1
    `, [vehicle_id]);
    const vehicle = vehicleQ.rows[0];
    if (!vehicle)
        throw new Error("VEHICLE_NOT_FOUND");
    if (vehicle.availability_status !== "available")
        throw new Error("VEHICLE_NOT_AVAILABLE");
    const numDays = daysBetween(rent_start_date, rent_end_date);
    if (numDays <= 0)
        throw new Error("INVALID_DATES");
    const totalPrice = Number(vehicle.daily_rent_price) * numDays;
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const insertQ = `
      INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
      VALUES ($1,$2,$3,$4,$5,'active')
      RETURNING *
    `;
        const { rows } = await client.query(insertQ, [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            totalPrice,
        ]);
        await client.query(`UPDATE vehicles SET availability_status='booked', updated_at=NOW() WHERE id=$1`, [vehicle_id]);
        await client.query("COMMIT");
        return {
            ...rows[0],
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: Number(vehicle.daily_rent_price),
            },
        };
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
}
async function getBookings(user) {
    if (user.role === "admin") {
        const { rows } = await db_1.pool.query(`
      SELECT 
        b.*,
        json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS customer,
        json_build_object('id', v.id, 'vehicle_name', v.vehicle_name, 'registration_number', v.registration_number)
        AS vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);
        return rows;
    }
    const { rows } = await db_1.pool.query(`
    SELECT 
      b.*,
      json_build_object('id', v.id, 'vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type)
      AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `, [user.id]);
    return rows;
}
async function getBookingById(bookingId) {
    const { rows } = await db_1.pool.query(`
    SELECT 
      b.*,
      json_build_object('name', u.name, 'email', u.email) AS customer,
      json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id=$1
    LIMIT 1
    `, [bookingId]);
    return rows[0];
}
async function updateBooking(bookingId, status, requester) {
    const booking = await getBookingById(bookingId);
    if (!booking)
        return null;
    if (status === "cancelled") {
        if (requester.role !== "admin" && requester.id !== booking.customer_id)
            return null;
        const today = new Date();
        const start = new Date(booking.rent_start_date);
        if (today >= start)
            return null;
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            const { rows } = await client.query(`
        UPDATE bookings 
        SET status='cancelled', updated_at=NOW() 
        WHERE id=$1 
        RETURNING *
        `, [bookingId]);
            await client.query(`UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`, [booking.vehicle_id]);
            await client.query("COMMIT");
            return rows[0];
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    }
    if (status === "returned") {
        if (requester.role !== "admin")
            return null;
        const client = await db_1.pool.connect();
        try {
            await client.query("BEGIN");
            const { rows } = await client.query(`
        UPDATE bookings 
        SET status='returned', updated_at=NOW() 
        WHERE id=$1 
        RETURNING *
        `, [bookingId]);
            await client.query(`UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`, [booking.vehicle_id]);
            await client.query("COMMIT");
            return {
                ...rows[0],
                vehicle: { availability_status: "available" },
            };
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    }
    return null;
}
async function autoReturnExpiredBookings() {
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const expired = await client.query(`
      SELECT id, vehicle_id 
      FROM bookings 
      WHERE status='active' AND rent_end_date < CURRENT_DATE
      `);
        for (const row of expired.rows) {
            await client.query(`UPDATE bookings SET status='returned', updated_at=NOW() WHERE id=$1`, [row.id]);
            await client.query(`UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`, [row.vehicle_id]);
        }
        await client.query("COMMIT");
        return expired.rows.length;
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
}
exports.bookingServices = {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    autoReturnExpiredBookings,
};
