import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import { signToken } from "../../utils/jwt";

type NewUserPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
};

async function findUserByEmail(email: string) {
  const { rows } = await pool.query(
    "SELECT id, name, email, password, phone, role FROM users WHERE email=$1 LIMIT 1",
    [email.toLowerCase()]
  );
  return rows[0] ?? null;
}

async function createUser(payload: NewUserPayload) {
  const hashed = await bcrypt.hash(payload.password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [
      payload.name,
      payload.email.toLowerCase(),
      hashed,
      payload.phone,
      payload.role ?? "customer",
    ]
  );
  return rows[0];
}

async function authenticateUser(emailRaw: string, password: string) {
  const email = emailRaw.toLowerCase();
  const userRow = await findUserByEmail(email);
  if (!userRow) throw new Error("INVALID_CREDENTIALS");

  const match = await bcrypt.compare(password, userRow.password);
  if (!match) throw new Error("INVALID_CREDENTIALS");

  const token = signToken({
    id: userRow.id,
    email: userRow.email,
    role: userRow.role,
    name: userRow.name,
  });

  const user = {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    phone: userRow.phone,
    role: userRow.role,
  };
  return { user, token };
}

export const authServices = {
  findUserByEmail,
  createUser,
  authenticateUser,
};
