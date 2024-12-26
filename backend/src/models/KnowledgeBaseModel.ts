/** @format */

import mongoose, { Document, Schema } from "mongoose";

interface IKnowledgeBase extends Document {
	name: string;
	data: object;
}

const knowledgeBaseSchema: Schema = new Schema({
	name: { type: String, required: true },
	data: { type: Object, required: true },
});

const KnowledgeBase = mongoose.model<IKnowledgeBase>("KnowledgeBase", knowledgeBaseSchema);
export default KnowledgeBase;
