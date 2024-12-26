/** @format */

import express from "express";
import { createKnowledgeBase, getKnowledgeBase, updateKnowledgeBase, deleteKnowledgeBase } from "../controllers/knowledgeBaseController";

const router = express.Router();

// Create a new knowledge base
router.post("/knowledgeBase", createKnowledgeBase);

// Get a knowledge base by ID
router.get("/knowledgeBase/:id", async (req: express.Request, res: express.Response) => {
	try {
		await getKnowledgeBase(req, res);
	} catch (error) {
		res.status(500).json({ message: "Error retrieving knowledge base", error: error.message });
	}
});

// Update a knowledge base by ID
router.put("/knowledgeBase/:id", async (req: express.Request, res: express.Response) => {
	try {
		await updateKnowledgeBase(req, res);
	} catch (error) {
		res.status(500).json({ message: "Error updating knowledge base", error: error.message });
	}
});

// Delete a knowledge base by ID
router.delete("/knowledgeBase/:id", async (req: express.Request, res: express.Response) => {
	try {
		await deleteKnowledgeBase(req, res);
	} catch (error) {
		res.status(500).json({ message: "Error deleting knowledge base", error: error.message });
	}
});

export default router;
