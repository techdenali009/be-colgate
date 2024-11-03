import mongoose, { Schema, Document } from 'mongoose';
import { Status } from './interfaces';

export interface ICategory extends Document {
  name: string;
  description: string;
  _id: string;
}

const CategorySchema: Schema = new Schema({

  name: { type: String, trim: true },
  _id: { type: String, required: true },
  description: { type: String, trim: true },
  status: { type: String, enum: Status, default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  isActive: { type: Boolean, default: true }
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;