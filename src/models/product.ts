import mongoose, { Document, Schema } from 'mongoose';

interface Shipping {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  internationalShipping: boolean;
  shippingClass: string;
}

interface InventoryLocation {
  warehouseId: mongoose.Types.ObjectId;
  quantity: number;
}

interface Image {
  url: string;
  altText: string;
}

export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategories: mongoose.Types.ObjectId[];
  price: number;
  discount: number;
  stock: number;
  isBestSeller: boolean;
  shipping: Shipping;
  inventoryLocations: InventoryLocation[];
  images: Image[];
  averageRating: number;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  isBestSeller: { type: Boolean, default: false },
  shipping: {
    weight: { type: Number, required: true },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    internationalShipping: { type: Boolean, default: false },
    shippingClass: { type: String, required: true },
  },
  inventoryLocations: [
    {
      warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
      quantity: { type: Number, required: true },
    },
  ],
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
  { timestamps: true });

export default mongoose.model<ProductDocument>('Product', productSchema);