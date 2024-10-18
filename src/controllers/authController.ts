import { Request, Response } from "express";
import { IUser } from "../models/interfaces";
import { loginService } from "../services/userService";
import { comparePasswords } from "../utils/passwordValidation";
import { failResponse, successResponse } from "../utils/response";
import { StatusCode } from "../utils/StatusCodes";
import { generateToken } from "../utils/jwt";
import { JwtTokenName } from "../utils/constants";


// POST login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const credentials = req.body as { email: string, password: string };
        const userInfo: IUser | any = await loginService(credentials?.email);
        console.log('userInfo', userInfo)
        if (!userInfo) {
            failResponse(res, "User Not Available", StatusCode.Not_Found);
            return;
        }
        if (userInfo?.password) {
            const password = await comparePasswords(credentials.password, userInfo.password);
            if (!password) {
                failResponse(res, "Unauthorized", StatusCode.Unauthorized);
                return;
            }
        }
        const token = await generateToken(userInfo);
        res.cookie(`${JwtTokenName}`, token, {
            httpOnly: true,
            secure: true, // Only on HTTPS in production
            sameSite: 'strict',  // CSRF protection
        });
        successResponse(res, { userInfo, token }, "User Authenticated successfully!", StatusCode.OK);
    } catch (err: any) {
        failResponse(res, err?.message || err, StatusCode.Bad_Request)
    }
} 