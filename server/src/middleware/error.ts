import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error for the developer
    console.error(`[Error] ${req.method} ${req.path} >> ${message}`);

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};