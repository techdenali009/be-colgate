import { ObjectId } from 'mongoose';
import { IUser } from '../models/interfaces';
import User from '../models/User';

export const getAllUsersService = async () => {
    try {
        return await User.find({isActive:true});
    } catch (err) {
        return err;
    }
}


export const createUserService = async (body: IUser): Promise<IUser | any> => {
    try {
        const user = await User.findOne({ email: body.email }, { email: 1 });
        if (user) {
            return {
                message: 'Duplicate Email',
                email: body.email
            };
        }
        const newUser = new User(body);
        const savedUser = await newUser.save();
    
        savedUser.createdBy = savedUser._id as ObjectId;
        savedUser.updatedBy = savedUser._id as ObjectId;
        await savedUser.save();
        return savedUser;
    } catch (err) {
        return err;
    }
}



export const deleteUserService = async (id: string) => {
    try {
        const userUpdate = await User.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    isActive: false
                }
            },
            { new: true, runValidators: true }
        );
        return userUpdate;
    } catch (err) {
        return err;
    }
}


export const updateUserService = async (id: string, data: any) => {
    try {
        const userUpdate = await User.findOneAndUpdate(
            { _id: id },
            {
                $set: data
            },
            { new: true, runValidators: true }
        );
        return userUpdate;
    } catch (err) {
        return err;
    }
}


export const loginService = async (email: string) => {
    try {
        return await User.findOne({ email })
    } catch (err) {
        return err;
    }
}
