import mongoose, { Document, Schema } from 'mongoose';
import { Status } from './interfaces';

interface Subcategory {
  name: string;
  description: string;
}

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  subcategories: Subcategory[]; // Updated to hold objects
  status?: Status;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  isActive: boolean;
}

const subcategorySchema = new Schema<Subcategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const categorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Status, default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  subcategories: { type: [subcategorySchema], default: [] },
});

export default mongoose.model<CategoryDocument>('Category', categorySchema);
