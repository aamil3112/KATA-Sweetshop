import { Router } from 'express';
import { InventoryController, purchaseValidation, restockValidation } from '../controllers/inventoryController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Protected routes - require authentication
router.post('/:id/purchase', authenticate, purchaseValidation, InventoryController.purchaseSweet);
router.post('/:id/restock', authenticate, requireAdmin, restockValidation, InventoryController.restockSweet);

export default router;

