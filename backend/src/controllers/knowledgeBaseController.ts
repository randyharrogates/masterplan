/** @format */

import { Request, Response } from "express";
import KnowledgeBase from "../models/KnowledgeBaseModel"; // Assuming KnowledgeBase model exists

// Create a new knowledge base
export const createKnowledgeBase = async (req: Request, res: Response) => {
	try {
		const { title, content } = req.body;

		const newKnowledgeBase = new KnowledgeBase({
			title,
			content,
		});

		await newKnowledgeBase.save();
		res.status(201).json({ message: "Knowledge Base created successfully!", data: newKnowledgeBase });
	} catch (error) {
		res.status(500).json({ message: "Error creating knowledge base", error: error.message });
	}
};

// Get a knowledge base by ID
export const getKnowledgeBase = async (req: Request, res: Response) => {
	try {
		const knowledgeBase = await KnowledgeBase.findById(req.params.id);

		if (!knowledgeBase) {
			return res.status(404).json({ message: "Knowledge base not found" });
		}

		res.status(200).json({ data: knowledgeBase });
	} catch (error) {
		res.status(500).json({ message: "Error retrieving knowledge base", error: error.message });
	}
};

// Update a knowledge base by ID
export const updateKnowledgeBase = async (req: Request, res: Response) => {
	try {
		const { title, content } = req.body;
		const knowledgeBase = await KnowledgeBase.findByIdAndUpdate(
			req.params.id,
			{ title, content },
			{ new: true } // Return the updated document
		);

		if (!knowledgeBase) {
			return res.status(404).json({ message: "Knowledge base not found" });
		}

		res.status(200).json({ message: "Knowledge base updated successfully!", data: knowledgeBase });
	} catch (error) {
		res.status(500).json({ message: "Error updating knowledge base", error: error.message });
	}
};

// Delete a knowledge base by ID
export const deleteKnowledgeBase = async (req: Request, res: Response) => {
	try {
		const knowledgeBase = await KnowledgeBase.findByIdAndDelete(req.params.id);

		if (!knowledgeBase) {
			return res.status(404).json({ message: "Knowledge base not found" });
		}

		res.status(200).json({ message: "Knowledge base deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting knowledge base", error: error.message });
	}
};
