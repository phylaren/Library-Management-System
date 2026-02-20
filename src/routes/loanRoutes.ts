import { Router } from 'express';
import * as LoanController from '../controllers/loanController';

const router = Router();

router.post('/', LoanController.createLoan);
router.post('/:id/return', LoanController.returnLoan);
router.get('/', LoanController.getLoans);

export default router;