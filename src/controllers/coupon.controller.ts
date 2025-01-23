import { Request, Response } from "express";
import { validateCoupon, applyCoupon, incrementCouponUsage, createCoupon as createCouponService } from "../services/coupon.service"; // Import the createCoupon service
import { successResponse, failResponse } from "../utils/response";
import { StatusCode } from "../utils/StatusCodes";
import { Messages } from "../utils/constants";

// POST apply coupon code
export const applyCouponCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, totalAmount } = req.body;

    console.log("Coupon Apply Request - Code:", code, "Total Amount:", totalAmount);

    // Validate coupon
    const coupon = await validateCoupon(code, totalAmount);
    console.log("Valid Coupon:", coupon);

    // Apply discount
    const discountedAmount = applyCoupon(coupon, totalAmount);
    const discountedTotal = discountedAmount.discountedTotal;
    console.log("Discounted Amount:", discountedAmount);

    // Increment usage
    await incrementCouponUsage(code);
    console.log("Coupon usage incremented for code:", code);

    // Send success response
    successResponse(res, {
      originalAmount: totalAmount,
      discountedAmount,
      discountValue: totalAmount - discountedTotal,
    }, "Coupon applied successfully.", StatusCode.OK);

  } catch (error: any) {
    console.error("Error applying coupon:", error?.message);
    failResponse(res, error?.message || "Something went wrong.", StatusCode.Bad_Request);
  }
};

// POST create a new coupon
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponData = req.body;
  
      // Validate the incoming coupon data
      if (!couponData.code || !couponData.discountType || !couponData.discountValue || !couponData.validFrom || !couponData.validUntil) {
        throw new Error("Missing required coupon fields");
      }
  
      // Call the service function to create a coupon
      const newCoupon = await createCouponService(couponData);
  
      // Send success response
      successResponse(res, newCoupon, "Coupon created successfully.", StatusCode.Created);
  
    } catch (error: any) {
      console.error("Error creating coupon:", error?.message);
      failResponse(res, error?.message || "Failed to create coupon.", StatusCode.Bad_Request);
    }
  };
