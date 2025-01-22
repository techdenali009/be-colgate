// models/coupon.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'flat'; // Percentage or flat discount
  discountValue: number; // e.g., 20% or $10
  minOrderAmount?: number; // Optional: Minimum order amount to apply the coupon
  maxDiscountAmount?: number; // Optional: Cap for percentage discounts
  validFrom: Date; // Start date
  validUntil: Date; // Expiry date
  usageLimit?: number; // Optional: Total usage allowed
  usedCount: number; // Tracks how many times the coupon has been used
  isActive: boolean; // Status of the coupon
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, default:"save10" },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number },
  maxDiscountAmount: { type: Number },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<ICoupon>('Coupon', couponSchema);
