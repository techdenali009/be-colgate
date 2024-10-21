import { Request, Response } from 'express';
import { getAllUsersService, createUserService, deleteUserService, updateUserService } from '../services/userService';
import { IUser } from '../models/interfaces';
import { failResponse, successResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';



// GET all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// POST create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser: IUser | any = await createUserService({ ...req.body, createdBy: null, updatedBy: null });
    if (newUser?.message === 'Duplicate Email' || !newUser?.email) {
      failResponse(res, newUser?.message, StatusCode.Bad_Request)
      return;
    }
    successResponse(res, newUser, "User Created successfully!", StatusCode.Created);
  } catch (error: any) {
    failResponse(res, error?.message || error, StatusCode.Bad_Request)
  }
};


// Delete delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const newUser: IUser | any = await deleteUserService(id);
    if (newUser?.message) {
      failResponse(res, newUser?.message, StatusCode.Bad_Request)
      return;
    }
    successResponse(res, { email: newUser?.email }, "User deleted successfully!", StatusCode.OK);
  } catch (error: any) {
    failResponse(res, error?.message || error, StatusCode.Bad_Request)
  }
};

// Put update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedUser: IUser | any = await updateUserService(id, req.body);
    if (updatedUser?.message) {
      failResponse(res, updatedUser?.message, StatusCode.Bad_Request);
      return
    }
    successResponse(res, req.body, "User Updated successfully!", StatusCode.OK);
  } catch (err: any) {
    console.log('err', err)
    failResponse(res, err?.message || err, StatusCode.Bad_Request)
  }
}

