import { User } from '@/models/UserModel';
import { Request, Response } from 'express'; 
import { generateToken } from "@/utils/jwt.utils";

export const login = async (req: Request, res: Response): Promise<void>=>{
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
    } 
    const token = generateToken(user._id.toString());
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request,res: Response): Promise<void>=>{
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).json({ message: 'User already exists' });
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = generateToken(newUser._id.toString());
    res.status(201).json({ token });
  } catch (error: unknown) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error" });
}
};

export const getallUsers = async (req: Request, res: Response): Promise<void>=>{
  try {
    const allUsers = await User.find();
    res.status(200).json({ allUsers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};