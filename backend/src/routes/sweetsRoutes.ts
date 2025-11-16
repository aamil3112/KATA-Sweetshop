import { Router } from 'express';
import { SweetsController, sweetValidation, searchValidation } from '../controllers/sweetsController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Protected routes - require authentication
router.get('/', authenticate, SweetsController.getAllSweets);
router.get('/search', authenticate, searchValidation, SweetsController.searchSweets);
router.get('/:id', authenticate, SweetsController.getSweetById);
router.post('/', authenticate, sweetValidation, SweetsController.createSweet);
router.put('/:id', authenticate, sweetValidation, SweetsController.updateSweet);
router.delete('/:id', authenticate, requireAdmin, SweetsController.deleteSweet);

export default router;

