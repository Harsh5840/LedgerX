// apps/backend/src/routes/riskRoutes.ts

import { Router } from "express";
import { handleRiskAssessment } from "../controllers/riskController";

const router: Router = Router();

// POST /api/risk/assess
router.post("/assess", handleRiskAssessment);

export default router;
