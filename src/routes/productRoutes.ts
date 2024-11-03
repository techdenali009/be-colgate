import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/product';

const router = express.Router();

// Create new products (handling multiple products)
router.post(
  '/',
  [
    body().isArray().withMessage('Expected an array of products'),
    body('*.name').isString().trim().notEmpty().withMessage('Name is required'),
    body('*.description').isString().trim().notEmpty().withMessage('Description is required'),
    body('*.price').isNumeric().notEmpty().withMessage('Price is required and should be numeric'),
    body('*.category').isMongoId().withMessage('Category must be a valid ObjectId'),
    body('*.inventoryLocations').isArray().withMessage('Inventory locations must be an array').custom((locations) => {
      if (!locations.length) {
        throw new Error('Inventory locations cannot be empty');
      }
      return true;
    }),
    body('*.shipping').isObject().withMessage('Shipping information is required').custom((shipping) => {
      if (!shipping.weight) {
        throw new Error('Shipping weight is required');
      }
      return true;
    }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Use Promise.all to save multiple products
      const products = await Promise.all(req.body.map(async (productData: any) => {
        const product = new Product(productData);
        await product.save();
        return product;
      }));

      res.status(201).json(products);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);


// Get all products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return; // Explicitly return to avoid implicit any
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update a product
router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('description').optional().isString().trim().notEmpty(),
    body('price').optional().isNumeric().notEmpty(),
    body('category').optional().isMongoId().withMessage('Category must be a valid ObjectId'),
    body('inventoryLocations').optional().isArray().withMessage('Inventory locations must be an array'),
    body('shipping').optional().isObject(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Explicitly return to avoid implicit any
    }

    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return; // Explicitly return to avoid implicit any
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Delete a product
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return; // Explicitly return to avoid implicit any
    }
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get('/productsdata', async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      res.status(400).json({ message: 'Category ID is required' });
      return;
    }
    const products = await Product.find({ category: categoryId }).populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params;

  try {
    // Fetch products with the specified category ID
    const products = await Product.find({ category: categoryId }).exec();

    // If no products are found, respond with a message
    if (!products.length) {
      res.status(404).json({ message: "No products found for this category" });
      return;
    }

    // Respond with the list of products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;