/** @format */

import mongoose, { Document, Schema } from "mongoose";

interface IAgent extends Document {
	name: string;
	type: string;
	config: object;
}

const agentSchema: Schema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	config: { type: Object, required: true },
});

const Agent = mongoose.model<IAgent>("Agent", agentSchema);
export default Agent;
