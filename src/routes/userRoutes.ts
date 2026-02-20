import { Router } from 'express';
import * as UserController from '../controllers/userController';

const router = Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserByID);

export default router;