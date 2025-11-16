import { Request, Response } from 'express';
import { InventoryService } from '../services/inventoryService';
import { body, validationResult } from 'express-validator';

export class InventoryController {
  static async purchaseSweet(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const quantity = req.body.quantity || 1;
      const sweet = await InventoryService.purchaseSweet(id, quantity);
      res.status(200).json(sweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async restockSweet(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const { quantity } = req.body;
      const sweet = await InventoryService.restockSweet(id, quantity);
      res.status(200).json(sweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const purchaseValidation = [
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

export const restockValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Restock quantity must be a positive integer'),
];

