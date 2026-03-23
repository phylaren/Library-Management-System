import { Router } from 'express';
import * as loanController from '../controllers/loanController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', loanController.getLoans);
router.post('/', loanController.createLoan);
router.post('/:id/return', loanController.returnLoan);

export default router;