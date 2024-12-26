/** @format */

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import agentRoutes from "./routes/agentRoutes";
import knowledgeBaseRoutes from "./routes/knowledgeBaseRoutes";
import { AppError } from "./middleware/errorHandler";
import connectDB from "./config/db";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to MongoDB using the custom connection function
connectDB();

const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/agents", agentRoutes); // Route for agents
app.use("/api/knowledge-base", knowledgeBaseRoutes); // Route for knowledge base

// Home Route
app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to the Multi-Agent Platform API");
});

// Global error handler middleware
app.use((err: any, req: Request, res: Response, next: any) => {
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";
	res.status(status).json({ message });
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
