// routes/coupon.routes.ts
import express from 'express';
import { applyCouponCode, createCoupon, deleteCoupon, getCoupons } from '../controllers/coupon.controller';
import { createCategories } from '../controllers/categoryController';

const router = express.Router();

// Apply coupon code (POST instead of GET)
router.post('/apply', applyCouponCode);
router.post('/create', createCoupon); 
router.get("/getAllcoupon", getCoupons);
router.delete("/deleteCouponsbyId/:identifier", deleteCoupon);


export default router;
