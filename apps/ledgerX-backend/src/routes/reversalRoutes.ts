    import express, { RequestHandler, Router } from 'express';
import { handleReversal } from '../controllers/reversalController';

const router: Router = express.Router();

router.post('/:originalHash/reverse', handleReversal as RequestHandler);

export default router;
    