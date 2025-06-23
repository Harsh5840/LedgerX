import { Router } from 'express';
import { createAndStoreTransaction } from '../controllers/transactionController';

const router = Router();

// POST /transactions
router.post('/', createAndStoreTransaction);

export default router;
