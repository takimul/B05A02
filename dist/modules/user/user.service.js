"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const db_1 = require("../../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function getAllUsers() {
    const { rows } = await db_1.pool.query(`SELECT id, name, email, phone, role FROM users ORDER BY id`);
    return rows;
}
async function getUserById(userId) {
    const { rows } = await db_1.pool.query(`SELECT id, name, email, phone, role FROM users WHERE id=$1 LIMIT 1`, [userId]);
    return rows[0];
}
async function updateUser(userId, payload) {
    const fields = [];
    const values = [];
    let idx = 1;
    const allowed = ["name", "email", "phone", "role"];
    for (const key of allowed) {
        if (payload[key] !== undefined) {
            fields.push(`${key}=$${idx}`);
            values.push(payload[key]);
            idx++;
        }
    }
    if (payload.password) {
        const hashed = await bcryptjs_1.default.hash(payload.password, 10);
        fields.push(`password=$${idx}`);
        values.push(hashed);
        idx++;
    }
    if (fields.length === 0)
        return getUserById(userId);
    const q = `UPDATE users SET ${fields.join(", ")}, updated_at=NOW() WHERE id=$${idx} RETURNING id, name, email, phone, role`;
    values.push(userId);
    const { rows } = await db_1.pool.query(q, values);
    return rows[0];
}
async function hasActiveBookings(userId) {
    const { rows } = await db_1.pool.query(`SELECT COUNT(*)::int AS cnt FROM bookings WHERE customer_id=$1 AND status='active'`, [userId]);
    return rows[0].cnt > 0;
}
async function deleteUser(userId) {
    const exists = await getUserById(userId);
    if (!exists)
        return false;
    const active = await hasActiveBookings(userId);
    if (active)
        return false;
    await db_1.pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
    return true;
}
exports.userServices = {
    getAllUsers,
    getUserById,
    updateUser,
    hasActiveBookings,
    deleteUser,
};
