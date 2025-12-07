import { Router } from "express";
import { signup, signin } from "./auth.controller";
import logger from "../../middleware/logger";

const router = Router();

router.post("/signup", logger, signup);
router.post("/signin", logger, signin);

export default router;
