// models/warehouse.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Status } from './interfaces';

export interface IWarehouse extends Document {
  name: string;
  location: string;
  capacity: number;
}

const WarehouseSchema: Schema = new Schema({
  name: { type: String, trim: true },
  location: { type: String, trim: true },
  capacity: { type: Number},
  status: { type: String, enum: Status, default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  isActive: { type: Boolean, default: true }
});

const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export default Warehouse;
