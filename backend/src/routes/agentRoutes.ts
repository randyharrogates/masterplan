/** @format */

import express from "express";
import { createChainedAgents } from "../controllers/agentController";

const router = express.Router();

// Create chained agents
router.post("/agents/chain", createChainedAgents);

export default router;
