import { Device } from '@/models/DeviceModel';
import { User } from '@/models/UserModel';
import { generateToken } from "@/utils/jwt.utils";
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

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
    res.status(201).json({ message: "Create Success" });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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

export const checkDeviceAuth = async (req: Request, res: Response): Promise<void> => {
  const { deviceId, password, rfid, fingerprint } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ message: 'Device not found' });
      return;
    }

    const authData = device.authData;
    let isAuthenticated = false;

    if (password) {
      const passwordAuth = authData.find(auth => auth.method === 'Password');
      if (passwordAuth && await bcrypt.compare(password, passwordAuth.data)) {
        isAuthenticated = true;
      }
    }

    if (rfid) {
      const rfidAuth = authData.find(auth => auth.method === 'RFID' && auth.data === rfid);
      if (rfidAuth) {
        isAuthenticated = true;
      }
    }

    if (fingerprint) {
      const fingerprintAuth = authData.find(auth => auth.method === 'Fingerprint' && auth.data === fingerprint);
      if (fingerprintAuth) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }

    res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

