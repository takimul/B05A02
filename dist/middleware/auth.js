"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                errors: "Missing token",
            });
        }
        const token = header.split(" ")[1];
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            name: payload.name,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            errors: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
const roleGuard = (...allowed) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!allowed.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                errors: "Insufficient permissions",
            });
        }
        next();
    };
};
exports.roleGuard = roleGuard;
