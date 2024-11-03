import mongoose,{ ObjectId, Document } from "mongoose";


export interface IBasicFields extends Document {
    isActive: boolean;
    createdAt: Date;
    createdBy: ObjectId;
    updatedAt: Date;
    updatedBy: ObjectId,
    status: string,
    version: number
}

// User interface
export interface IUser extends IBasicFields {
    email: string;
    firstName: string;
    lastName: string
    password: string;
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