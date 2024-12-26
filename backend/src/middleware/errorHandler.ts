/** @format */

import { Request, Response, NextFunction } from "express";

// Define a custom error class to standardize error responses
class AppError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true; // indicates if the error is a known operational error
		Error.captureStackTrace(this, this.constructor);
	}
}

// The error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	// Default to 500 Internal Server Error
	const statusCode = err.statusCode || 500;
	const message = err.message || "Something went wrong";

	// If the error is operational, send the error message
	if (err.isOperational) {
		return res.status(statusCode).json({
			status: "error",
			statusCode,
			message,
		});
	}

	// For programming or other unexpected errors, log the error stack trace and send a generic message
	console.error(err); // Log the error for internal debugging
	return res.status(500).json({
		status: "error",
		statusCode: 500,
		message: "Internal Server Error",
	});
};

// Exporting the AppError class and error handler middleware
export { AppError, errorHandler };
