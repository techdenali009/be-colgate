import mongoose, { Document, Schema } from 'mongoose';
import { Status } from './interfaces';
export interface InventoryLocation {
  warehouseId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ShippingInfo {
  weight: number;
  dimensions?: { length: number; width: number; height: number };
  internationalShipping?: boolean;
  shippingClass?: string;
}

export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategories?: mongoose.Types.ObjectId[];
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  inventoryLocations: InventoryLocation[];
  shipping: ShippingInfo;
  images?: { url: string; altText?: string; order?: number }[];
  averageRating?: number;
  status?: Status;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  isActive: boolean; 
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  inventoryLocations: [
    {
      warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
  shipping: {
    weight: { type: Number, required: true },
    dimensions: { length: Number, width: Number, height: Number },
    internationalShipping: { type: Boolean, default: false },
    shippingClass: { type: String, enum: ['Standard', 'Express', 'Overnight'], default: 'Standard' },
  },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String },
      order: { type: Number },
    },
  ],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  status: { type: String, enum: Status, default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  isActive: { type: Boolean, default: true }
});

// Middleware for calculating final price before saving
productSchema.pre<ProductDocument>('save', function (next) {
  this.finalPrice = this.price - (this.price * (this.discount ?? 0) / 100);
  next();
});

// Method to update average rating after a review is added
productSchema.methods.calculateAverageRating = function (): number {
  if (this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((sum: any, review: { rating: any; }) => sum + review.rating, 0) / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  return this.averageRating;
};

export default mongoose.model<ProductDocument>('Product', productSchema);
