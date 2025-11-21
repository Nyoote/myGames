import User from "../models/user.model.js";
export const users = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "Error, cannot find users" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        });
    } catch (err) {
        res.status(500).json({ message: "Unable to fetch user info" });
    }
};