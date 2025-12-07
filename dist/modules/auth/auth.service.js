"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const db_1 = require("../../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
async function findUserByEmail(email) {
    const { rows } = await db_1.pool.query("SELECT id, name, email, password, phone, role FROM users WHERE email=$1 LIMIT 1", [email.toLowerCase()]);
    return rows[0] ?? null;
}
async function createUser(payload) {
    const hashed = await bcryptjs_1.default.hash(payload.password, 10);
    const { rows } = await db_1.pool.query(`INSERT INTO users (name, email, password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`, [
        payload.name,
        payload.email.toLowerCase(),
        hashed,
        payload.phone,
        payload.role ?? "customer",
    ]);
    return rows[0];
}
async function authenticateUser(emailRaw, password) {
    const email = emailRaw.toLowerCase();
    const userRow = await findUserByEmail(email);
    if (!userRow)
        throw new Error("INVALID_CREDENTIALS");
    const match = await bcryptjs_1.default.compare(password, userRow.password);
    if (!match)
        throw new Error("INVALID_CREDENTIALS");
    const token = (0, jwt_1.signToken)({
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
exports.authServices = {
    findUserByEmail,
    createUser,
    authenticateUser,
};
