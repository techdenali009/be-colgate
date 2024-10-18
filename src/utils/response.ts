import { Response } from 'express';

// Success response format
export const successResponse = (res: Response, data: any, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

// Failure response format (for client-side errors)
export const failResponse = (res: Response, message: string | any = 'Fail', statusCode = 400) => {
    return res.status(statusCode).json({
        status: 'fail',
        message,
    });
};

// Error response format (for server-side errors)
export const errorResponse = (res: Response, message = 'Internal Server Error', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        error,
    });
};

