import { pool } from "../../config/db";

async function createVehicle(payload: any) {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const { rows } = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status ?? "available",
    ]
  );
  return rows[0];
}

async function getAllVehicles() {
  const { rows } = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles ORDER BY id`
  );
  return rows;
}

async function getVehicleById(id: number) {
  const { rows } = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id=$1 LIMIT 1`,
    [id]
  );
  return rows[0];
}

async function updateVehicle(id: number, payload: any) {
  const fields = [];
  const values: any[] = [];
  let idx = 1;
  const allowed = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      fields.push(`${key}=$${idx}`);
      values.push(payload[key]);
      idx++;
    }
  }
  if (fields.length === 0) return getVehicleById(id);

  const q = `UPDATE vehicles SET ${fields.join(
    ", "
  )}, updated_at=NOW() WHERE id=$${idx} RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`;
  values.push(id);
  const { rows } = await pool.query(q, values);
  return rows[0];
}

async function hasActiveBookings(vehicleId: number) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [vehicleId]
  );
  return rows[0].cnt > 0;
}

async function deleteVehicle(id: number) {
  const exists = await getVehicleById(id);
  if (!exists) return false;
  const active = await hasActiveBookings(id);
  if (active) return false;
  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return true;
}

async function setVehicleAvailability(
  vehicleId: number,
  status: "available" | "booked"
) {
  await pool.query(
    `UPDATE vehicles SET availability_status=$1, updated_at=NOW() WHERE id=$2`,
    [status, vehicleId]
  );
}

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  hasActiveBookings,
  deleteVehicle,
  setVehicleAvailability,
};
