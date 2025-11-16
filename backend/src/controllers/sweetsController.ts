import { Request, Response } from 'express';
import { SweetsService } from '../services/sweetsService';
import { body, validationResult, query } from 'express-validator';

export class SweetsController {
  static async getAllSweets(req: Request, res: Response): Promise<void> {
    try {
      const sweets = await SweetsService.getAllSweets();
      res.status(200).json(sweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSweetById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const sweet = await SweetsService.getSweetById(id);
      res.status(200).json(sweet);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async searchSweets(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const searchParams: any = {};
      if (req.query.name) searchParams.name = req.query.name as string;
      if (req.query.category) searchParams.category = req.query.category as string;
      if (req.query.minPrice) searchParams.minPrice = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) searchParams.maxPrice = parseFloat(req.query.maxPrice as string);

      const sweets = await SweetsService.searchSweets(searchParams);
      res.status(200).json(sweets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createSweet(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const sweet = await SweetsService.createSweet(req.body);
      res.status(201).json(sweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateSweet(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const sweet = await SweetsService.updateSweet(id, req.body);
      res.status(200).json(sweet);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteSweet(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await SweetsService.deleteSweet(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export const sweetValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

export const searchValidation = [
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
];

