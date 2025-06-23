import { Router } from 'express';
import transactionRoutes from './transactionRoutes';
import spendingRoutes from './spendingRoutes';

const router: Router = Router();

router.use('/transactions', transactionRoutes);
router.use('/spending', spendingRoutes);

export default router;
