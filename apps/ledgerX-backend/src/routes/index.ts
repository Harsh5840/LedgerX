import { Router } from 'express';

import accountRoutes from './accountRoutes';
import transactionRoutes from './transactionRoutes';
import analyticsRoutes from './analyticsRoutes';
import fraudRoutes from './fraudRoutes';
import riskRoutes from './riskRoutes';
import reversalRoutes from './reversalRoutes';
import nlpRoutes from './nlpRoutes';

const router : Router = Router();

// Mount all route modules
router.use('/accounts', accountRoutes);         // /api/accounts
router.use('/transactions', transactionRoutes); // /api/transactions
router.use('/analytics', analyticsRoutes);      // /api/analytics
router.use('/fraud', fraudRoutes);              // /api/fraud
router.use('/risk', riskRoutes);                // /api/risk
router.use('/reversal', reversalRoutes);        // /api/reversal
router.use('/nlp', nlpRoutes);                  // /api/nlp

export default router;
