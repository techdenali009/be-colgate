// services/coupon.service.ts
import Coupon from "../models/coupon.model";
import { ICoupon } from "../models/coupon.model";
import { couponError } from "../utils/constants";

export const validateCoupon = async (code: string, totalAmount: number) => {
  console.log("Received Coupon Code:", code);  // Log the coupon code

  // Find the coupon in the database
  const coupon = await Coupon.findOne({ code, isActive: true });

  console.log("Fetched Coupon from DB:", coupon);  // Log the fetched coupon

  if (!coupon) throw new Error("Invalid or expired coupon code.");

  const currentDate = new Date();
  console.log("Current Date:", currentDate);
  console.log("Coupon Valid From:", coupon.validFrom, "Valid Until:", coupon.validUntil);

  if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
    throw new Error(couponError.expired);
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error(couponError.usageLimitExceeded);
  }

  if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount of ₹ ${coupon.minOrderAmount} is required.`);
  }

  return coupon;
};

export const applyCoupon = (coupon: ICoupon, totalAmount: number) => {
  let discount = 0;

  if (coupon.discountType === 'percentage') {
    discount = (totalAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else if (coupon.discountType === 'flat') {
    discount = coupon.discountValue;
  }

  return { discountAmount: discount, discountedTotal: totalAmount - discount };
};

export const incrementCouponUsage = async (code: string) => {
  await Coupon.findOneAndUpdate({ code }, { $inc: { usedCount: 1 } });
};

// Create Coupon Service
export const createCoupon = async (couponData: ICoupon) => {
  // Create a new coupon based on the provided data
  const coupon = new Coupon(couponData);

  // Save the coupon to the database
  try {
    const savedCoupon = await coupon.save();
    console.log("Coupon created successfully:", savedCoupon);
    return savedCoupon;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw new Error("Error creating coupon");
  }
};
