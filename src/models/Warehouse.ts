// models/warehouse.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Status } from './interfaces';

// Define types for location and products
interface Location {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface Product {
  product_id: mongoose.Schema.Types.ObjectId;
  quantity: number;
  last_updated: Date;
}

export interface IWarehouse extends Document {
  name: string;
  location: Location;
  products: Product[];
  status: Status;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Schema.Types.ObjectId;
  updatedBy?: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
}

const WarehouseSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
      country: { type: String, required: true },
    },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 0 },
        last_updated: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: Object.values(Status), default: Status.Active },
    version: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export default Warehouse;
