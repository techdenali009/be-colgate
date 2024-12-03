import { Router } from 'express';
import { createProducts, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getRecentlyViewedProducts, getRelatedProducts } from '../controllers/productsController';
import { productValidationRules } from '../middlewares/ProductValidations';

const router = Router();
// Routes
router.post('/', productValidationRules, createProducts);
router.post('/recently-viewedProducts', getRecentlyViewedProducts);
router.get('/getReletive', getRelatedProducts)
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/category/:categoryId', getProductsByCategory);

export default router;