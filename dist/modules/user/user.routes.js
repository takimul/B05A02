"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const logger_1 = __importDefault(require("../../middleware/logger"));
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get("/", logger_1.default, auth_1.authenticate, (0, auth_1.roleGuard)("admin"), user_controller_1.userControllers.getAllUsers);
router.put("/:userId", logger_1.default, auth_1.authenticate, user_controller_1.userControllers.updateUser);
router.delete("/:userId", logger_1.default, auth_1.authenticate, (0, auth_1.roleGuard)("admin"), user_controller_1.userControllers.deleteUser);
exports.default = router;
