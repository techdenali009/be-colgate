import { ObjectId, Document } from "mongoose";


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
    userType: UserType
}

export enum UserType {
    Admin = "admin",
    User = "User",
    Operator = "Operator"
}

// enums 
export enum Status {
    Active = 'active',
    InActive = 'inactive',
    Deleted = 'deleted'
}