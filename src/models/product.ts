import mongoose, { Document, Schema, Model } from 'mongoose';
import { Status } from './interfaces';

// Define interfaces for sub-documents
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

// Define the main Product interface extending Mongoose's Document
export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategories?: mongoose.Types.ObjectId[];
  price: number;
  discount?: number;
  stock: number;
  inventoryLocations: InventoryLocation[];
  shipping: ShippingInfo;
  images?: { url: string; altText?: string; order?: number }[];
  averageRating?: number;
  isBestSeller ?: boolean;
  status?: Status;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  isActive: boolean;
}

// Define the schema
const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true, min: 0 },
  inventoryLocations: [
    {
      warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
  shipping: {
    weight: { type: Number, required: true },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
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
  isBestSeller: {type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
});

// Create and export the Product model
const Product: Model<ProductDocument> = mongoose.model<ProductDocument>('Product', productSchema);
export default Product;
