import { Router } from 'express';
import * as BookController from '../controllers/bookController';

const router = Router();

router.get('/', BookController.getBooks);
router.get('/:id', BookController.getBookByID);
router.post('/', BookController.createBook);
router.put('/:id', BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

export default router;