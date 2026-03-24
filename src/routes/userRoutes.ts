import { Router } from 'express';
import * as UserController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/me', authenticate, UserController.getCurrentUser); 

router.get('/', authenticate, authorizeRole('ADMIN'), UserController.getUsers);
router.get('/:id', authenticate, authorizeRole('ADMIN'), UserController.getUserByID);

export default router;