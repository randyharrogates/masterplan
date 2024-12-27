/** @format */

import { Request, Response } from "express";
import Agent from "../models/AgentModel";
import { StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// Create a new dynamic agent with chained actions
export const createChainedAgents = async (req: Request, res: Response) => {
	try {
		const { name, description, actions, agentChain } = req.body;

		// Store the agent in the database
		const newAgent = new Agent({ name, description, actions });
		await newAgent.save();

		// Initialize LangGraph tools (each action is mapped to a tool)
		const tools = actions.map((action: string) => ({
			name: action,
			execute: async () => {
				// Logic for each action (you can customize the logic here)
				return `Executed action: ${action}`;
			},
		}));

		// Create the LangGraph model (using OpenAI or any other model you prefer)
		const model = new ChatOpenAI({ model: "gpt-4" });

		// Create a ToolNode from the defined tools
		const toolNode = new ToolNode(tools);

		// Create a StateGraph to handle the chaining of agents
		const workflow = new StateGraph();

		// Add the first agent in the chain
		workflow.addNode("agent1", model); // First agent in the chain
		workflow.addNode("tools1", toolNode);
		workflow.addEdge("__start__", "agent1");
		workflow.addEdge("agent1", "tools1");

		// Dynamically chain the other agents based on user input
		agentChain.forEach((agentConfig: any, index: number) => {
			const nextAgent = new ChatOpenAI({ model: "gpt-4" });

			const nextToolNode = new ToolNode(
				agentConfig.actions.map((action: string) => ({
					name: action,
					execute: async () => `Executed action: ${action}`,
				}))
			);

			workflow.addNode(`agent${index + 2}`, nextAgent);
			workflow.addNode(`tools${index + 2}`, nextToolNode);
			workflow.addEdge(`tools${index + 1}`, `agent${index + 2}`);
			workflow.addEdge(`agent${index + 2}`, `tools${index + 2}`);
		});

		// Optionally, you can add a final "end" state or return the result here
		workflow.addEdge(`tools${agentChain.length + 1}`, "END");

		// Compile the graph
		const compiledGraph = workflow.compile();

		// Optionally, store the LangGraph config for later use
		const langAgentConfig = {
			id: newAgent._id.toString(),
			name: newAgent.name,
			description: newAgent.description,
			actions: tools,
		};

		res.status(201).json({
			message: "Chained agents created successfully!",
			data: langAgentConfig,
			graph: compiledGraph, // You can return the graph or its ID to store it in your DB
		});
	} catch (error) {
		res.status(500).json({ message: "Error creating chained agents", error });
	}
};

// Get agent by ID (to retrieve agent information and their graph)
export const getAgentById = async (req: Request, res: Response) => {
	try {
		const agent = await Agent.findById(req.params.id);

		if (!agent) {
			return res.status(404).json({ message: "Agent not found" });
		}

		// Optionally, you could fetch or recreate the agent's LangGraph here if needed

		res.status(200).json({ message: "Agent found", data: agent });
	} catch (error) {
		res.status(500).json({ message: "Error fetching agent", error });
	}
};
