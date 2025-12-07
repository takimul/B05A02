import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

async function getAllUsers() {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id`
  );
  return rows;
}

async function getUserById(userId: number) {
  const { rows } = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id=$1 LIMIT 1`,
    [userId]
  );
  return rows[0];
}

async function updateUser(userId: number, payload: any) {
  const fields = [];
  const values: any[] = [];
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
    const hashed = await bcrypt.hash(payload.password, 10);
    fields.push(`password=$${idx}`);
    values.push(hashed);
    idx++;
  }
  if (fields.length === 0) return getUserById(userId);
  const q = `UPDATE users SET ${fields.join(
    ", "
  )}, updated_at=NOW() WHERE id=$${idx} RETURNING id, name, email, phone, role`;
  values.push(userId);
  const { rows } = await pool.query(q, values);
  return rows[0];
}

async function hasActiveBookings(userId: number) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM bookings WHERE customer_id=$1 AND status='active'`,
    [userId]
  );
  return rows[0].cnt > 0;
}

async function deleteUser(userId: number) {
  const exists = await getUserById(userId);
  if (!exists) return false;
  const active = await hasActiveBookings(userId);
  if (active) return false;
  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
  return true;
}

export const userServices = {
  getAllUsers,
  getUserById,
  updateUser,
  hasActiveBookings,
  deleteUser,
};
