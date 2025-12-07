"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const logger_1 = __importDefault(require("../../middleware/logger"));
const router = (0, express_1.Router)();
router.post("/signup", logger_1.default, auth_controller_1.signup);
router.post("/signin", logger_1.default, auth_controller_1.signin);
exports.default = router;
