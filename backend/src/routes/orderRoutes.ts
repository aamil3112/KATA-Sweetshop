import { Router } from 'express';
import { OrderController, orderValidation } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.post('/', authenticate, orderValidation, OrderController.createOrder);
router.get('/my-orders', authenticate, OrderController.getUserOrders);
router.get('/stats', authenticate, requireAdmin, OrderController.getOrderStats);
router.get('/:id', authenticate, OrderController.getOrderById);
router.get('/', authenticate, requireAdmin, OrderController.getAllOrders);

export default router;

