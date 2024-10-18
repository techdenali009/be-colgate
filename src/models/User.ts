import { Schema, model, Document, ObjectId, Mongoose } from 'mongoose';
import { IUser, Status } from './interfaces';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true,
  },
  status: { type: String, enum: Status, default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});



userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  const saltRounds = +`${process.env.PASSWORD_SALT}`; 
  console.log('saltRounds', saltRounds)
  this.password = await bcrypt.hash(this.password, saltRounds); 
  next();
});


userSchema.pre(['findOneAndUpdate', 'updateOne'], async function (next) {
  const update = this.getUpdate() as any;
  const password = update?.$set?.password;
  if (password) {
    const salt = await bcrypt.genSalt(+`${process.env.PASSWORD_SALT}`);
    const hashedPassword = await bcrypt.hash(password, salt);
    this.set({ password: hashedPassword });
  }
  this.set({ updatedAt: new Date() });
  next();
});



export default model<IUser>('User', userSchema);
