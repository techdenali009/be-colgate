import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  subcategories: mongoose.Types.ObjectId[]; // References Subcategory IDs
  status?: string;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<CategoryDocument>('Category', categorySchema);
