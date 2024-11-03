import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Category from '../models/Category';
import Product from '../models/product';

const router = express.Router();

router.post(
  '/',
  [
    // Check if it's an array or single object and validate accordingly
    body().custom((value) => {
      if (Array.isArray(value)) {
        // Array case
        value.forEach((item) => {
          if (!item.name || !item.description) {
            throw new Error('Each category item must have name and description');
          }
        });
      } else {
        // Single object case
        if (!value.name || !value.description) {
          throw new Error('Category must have name and description');
        }
      }
      return true;
    })
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      if (Array.isArray(req.body)) {
        // Insert multiple categories
        const categories = await Category.insertMany(req.body);
        res.status(201).json(categories);
      } else {
        // Insert single category
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);
// Get all categories
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get category by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// New: Get products by category
router.get('/:id/products', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ category: req.params.id });
    if (products.length === 0) {
      res.status(404).json({ message: 'No products found for this category' });
      return;
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update a category
router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('description').optional().isString().trim().notEmpty(),
    body('_id').optional().isString().trim().notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Delete a category
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(204).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
