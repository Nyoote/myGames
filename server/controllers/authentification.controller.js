import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUsername = await User.findOne({username});
        if (existingUsername)
            return res.status(409).json({ field: "username",error: "Username is already taken" });
        const existingEmail = await User.findOne({email});
        if (existingEmail)
            return res.status(409).json({ field: "email",error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const INVALID = "Invalid email or password";
        const user = await User.findOne({email});

        const DUMMY_HASH = "$2b$10$VnH4lD8u4iQ0G1rQH2YfUuWm8.7p5p8mXlZc6gQ2bW1aKx7b3F6Si";
        const hashToCompare = user?.password || DUMMY_HASH;
        const isPasswordMatch = await bcrypt.compare(password, hashToCompare);

        if (!user || !isPasswordMatch)
            return res.status(401).json({ error: INVALID });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
