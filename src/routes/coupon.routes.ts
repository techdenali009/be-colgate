// routes/coupon.routes.ts
import express from 'express';
import { applyCouponCode, createCoupon } from '../controllers/coupon.controller';
import { createCategories } from '../controllers/categoryController';

const router = express.Router();

// Apply coupon code (POST instead of GET)
router.post('/apply', applyCouponCode);
router.post('/create', createCoupon); 


export default router;
