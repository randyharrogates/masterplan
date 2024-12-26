/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = new User({ email, password: hashedPassword });
		await newUser.save();

		res.status(201).json({ message: "User created successfully" });
	} catch (err) {
		res.status(500).json({ message: "Error registering user" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate a JWT token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
			expiresIn: "1h",
		});

		res.status(200).json({ token });
	} catch (err) {
		res.status(500).json({ message: "Error logging in user" });
	}
};
