/** @format */

import express from "express";
import { getAgents, createAgent } from "../controllers/agentController.ts";

const router = express.Router();

router.get("/", getAgents);
router.post("/", createAgent);

export default router;
