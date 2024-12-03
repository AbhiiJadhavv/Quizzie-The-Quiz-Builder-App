import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this Email',
                success: false
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password and Confirm Password should match',
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Please enter valid email',
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect Password',
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '7d' });

        res.status(200).json({
            message: `Welcome ${user.name}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}