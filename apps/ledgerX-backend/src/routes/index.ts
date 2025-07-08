import { Router } from 'express';

import accountRoutes from './accountRoutes';
import transactionRoutes from './transactionRoutes';
import analyticsRoutes from './analyticsRoutes';
import fraudRoutes from './fraudRoutes';
import riskRoutes from './riskRoutes';
import reversalRoutes from './reversalRoutes';
import nlpRoutes from './nlpRoutes';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes'; // ✅ ADD THIS LINE

const router: Router = Router();

// Mount all route modules
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/fraud', fraudRoutes);
router.use('/risk', riskRoutes);
router.use('/reversal', reversalRoutes);
router.use('/nlp', nlpRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes); // ✅ ADD THIS LINE (/api/auth/google etc.)

export default router;
