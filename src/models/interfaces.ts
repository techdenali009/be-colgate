import mongoose, { ObjectId, Document } from "mongoose";


export interface IBasicFields extends Document {
  isActive: boolean;
  createdAt: Date;
  createdBy: ObjectId;
  updatedAt: Date;
  updatedBy: ObjectId,
  status: string,
  version: number
}

export interface BasicQueryFields {
  search?: string,
  page?: number,
  limit?: number,
  userType?: string,
  status?: string
}
// User interface
export interface IUser extends IBasicFields {
  email: string;
  firstName: string;
  lastName: string
  password: string;
  userType: UserType,
  profilePic: string,
  isVerified: Boolean,
  verificationToken: string | null, // Invalidate the token
  tokenCreatedAt: Date,
  hashedToken: string | null,
  favoriteProducts: string[],
  addresses: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    phone: number
  }[]
}

export enum UserType {
  Admin = "admin",
  User = "user",
  Operator = "Operator"
}

// enums 
export enum Status {
  Active = 'active',
  InActive = 'inactive',
  Deleted = 'deleted'
}

export interface InventoryLocation {
  warehouseId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  internationalShipping?: boolean;
  shippingClass: ShippingClass; // Change this to use the enum
}

export interface ImageInfo {
  url: string;
  altText?: string;
  order?: number;
}

export interface Review {
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  date?: Date;
}

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
export enum OrderStatus {
  "Pending" = "Pending",
  "Processing" = "Processing",
  "Shipped" = "Shipped",
  "Delivered" = "Delivered",
  "Cancelled" = "Cancelled"
}


export interface ProductDocument extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategories?: mongoose.Types.ObjectId[];
  brand: string;
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  inventoryLocations?: InventoryLocation[];
  shipping: ShippingInfo;
  images?: ImageInfo[];
  reviews?: Review[];
  averageRating?: number;
  relatedProducts?: mongoose.Types.ObjectId[];
  status?: ProductStatus; // Change this to use the enum
  createdAt?: Date;
  updatedAt?: Date;
  calculateAverageRating: () => number;
}

export interface OrderProductInfo {
  product: ObjectId,
  quantity: number,
  priceSnapshot: number,
}

export interface IOrder extends IBasicFields {
  userId: ObjectId,
  products: OrderProductInfo[

  ],
  shippingAddress: {
    address: string,
    city: string,
    postalCode: string,
    country: string,
  },
  billingAddress: {
    address: string,
    city: string,
    postalCode: string,
    country: string,
  },
  paymentInfo: {
    method: string, // e.g., 'Credit Card', 'PayPal', 'COD'
    status: string, // 'Pending', 'Paid', 'Failed'
    transactionId: string, // Optional, for tracking payment
  },

  discount: {
    couponCode: string //'SAVE20',
    amount: number
  }
  orderStatus: OrderStatus,
  estimatedDelivery: Date
  totalAmount: number,
  taxAmount: number,
  shippingCost: number,
  comments: { userId: string, message: string, createdAt: Date }[],
  orderId: string,
  couponCode: string
}