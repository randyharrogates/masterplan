/** @format */

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import agentRoutes from "./routes/agentRoutes"; // Agent routes
import knowledgeBaseRoutes from "./routes/knowledgeBaseRoutes"; // Knowledge base routes
import { AppError } from "./middleware/errorHandler"; // Custom error handler
import connectDB from "./config/db"; // Database connection
import { OpenAI } from "@langchain/openai"; // Import OpenAI integration from LangChain
import { StateGraph } from "@langchain/langgraph"; // LangGraph for stateful workflows
import { ToolNode } from "@langchain/langgraph/prebuilt"; // ToolNode for agent tools
import { DynamicStructuredTool } from "@langchain/core/tools"; // Import DynamicStructuredTool from LangChain

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to MongoDB using the custom connection function
connectDB();

const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// LangChain OpenAI configuration
const openAIKey = process.env.OPENAI_API_KEY; // Access OpenAI API key from environment variables

if (!openAIKey) {
	throw new Error("OpenAI API key is missing in environment variables");
}

const model = new OpenAI({ apiKey: openAIKey }); // Initialize OpenAI model

// Create a function to dynamically create agents
const createDynamicAgent = async (name: string, actions: string[]) => {
	// Initialize LangGraph tools (each action is mapped to a tool)
	const tools = actions.map((action: string) => {
		return new DynamicStructuredTool({
			name: action,
			description: `This tool executes the action: ${action}`, // Add description
			schema: {}, // Define the schema for your tool (empty schema for example)
			func: async () => {
				// Logic for each action
				return `Executed action: ${action}`;
			},
		});
	});

	// Create a ToolNode from the defined tools
	const toolNode = new ToolNode(tools);

	// Create a StateGraph to handle the chaining of agents
	const workflow = new StateGraph();
	workflow.addNode("agent", model); // First agent in the chain
	workflow.addNode("tools", toolNode);
	workflow.addEdge("__start__", "agent");
	workflow.addEdge("agent", "tools");

	// Compile the graph
	const compiledGraph = workflow.compile();

	// Return the compiled graph for further use
	return {
		name,
		actions: tools,
		graph: compiledGraph,
	};
};

// Routes
app.use("/api/agents", agentRoutes); // Route for agents
app.use("/api/knowledge-base", knowledgeBaseRoutes); // Route for knowledge base

// Route to create a dynamic agent
app.post("/api/agents/create", async (req: Request, res: Response) => {
  const { name, actions } = req.body;

  try {
    const agent = await createDynamicAgent(name, actions);
    res.status(201).json({
      message: "Dynamic agent created successfully!",
      data: agent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating dynamic agent",
      error: error.message || error,
    });
  }
});

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
