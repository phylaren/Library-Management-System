import { Router } from 'express';
import * as UserController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { uploadAvatar } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/me', authenticate, UserController.getCurrentUser); 

router.get('/', authenticate, authorizeRole('ADMIN'), UserController.getUsers);
router.get('/:id', authenticate, authorizeRole('ADMIN'), UserController.getUserByID);

router.post('/me/avatar', authenticate, uploadAvatar, UserController.uploadAvatar);
router.delete('/me/avatar', authenticate, UserController.deleteAvatar);

export default router;

