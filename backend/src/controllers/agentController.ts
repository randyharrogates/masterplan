/** @format */

import { Request, Response } from "express";
import Agent from "../models/AgentModel";

export const getAgents = async (req: Request, res: Response) => {
	try {
		const agents = await Agent.find();
		res.json(agents);
	} catch (err) {
		res.status(500).send("Error fetching agents");
	}
};

export const createAgent = async (req: Request, res: Response) => {
	try {
		const { name, type, config } = req.body;
		const newAgent = new Agent({ name, type, config });
		await newAgent.save();
		res.status(201).json(newAgent);
	} catch (err) {
		res.status(400).send("Error creating agent");
	}
};
