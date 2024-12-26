/** @format */

import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/masterplan");
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

export default connectDB;
