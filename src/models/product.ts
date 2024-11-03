import mongoose, { Schema } from 'mongoose';
import { ProductDocument, InventoryLocation, ShippingInfo, ImageInfo, Review } from './interfaces';

export enum ShippingClass {
  Standard = 'Standard',
  Express = 'Express',
  Overnight = 'Overnight',
}

export enum ProductStatus {
  Available = 'Available',
  OutOfStock = 'Out of Stock',
  Discontinued = 'Discontinued',
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  brand: { type: String, required: true },
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
    shippingClass: { type: String, enum: Object.values(ShippingClass), default: ShippingClass.Standard }, // Using enum
  },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String },
      order: { type: Number },
    },
  ],
  reviews: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, trim: true },
      date: { type: Date, default: Date.now },
    },
  ],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.Available }, // Using enum
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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
