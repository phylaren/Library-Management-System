import { Router } from 'express';
import * as bookController from '../controllers/bookController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);


router.post('/', authenticate, authorizeRole('ADMIN'), bookController.createBook);
router.put('/:id', authenticate, authorizeRole('ADMIN'), bookController.updateBook);
router.delete('/:id', authenticate, authorizeRole('ADMIN'), bookController.deleteBook);

export default router;