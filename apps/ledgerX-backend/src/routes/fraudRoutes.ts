// apps/backend/src/routes/fraudRoutes.ts

import { RequestHandler, Router } from "express";
import { handleFraudCheck } from "../controllers/fraudController";

const router: Router = Router();

router.post("/check", handleFraudCheck as RequestHandler); // POST /fraud/check

export default router;
