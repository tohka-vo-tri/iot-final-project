import { Device } from '@/models/DeviceModel';
import { User } from '@/models/UserModel';
import { generateToken } from "@/utils/jwt.utils";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { Request, Response } from 'express';
import { Log } from '@/models/LogModel';

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
      return;
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
    if (userExists){
      res.status(400).json({ message: 'User already exists' });
      return;
    } 
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Create Success" });
  } catch (err : unknown) {
    res.status(500).json({ message: err });
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

    console.log('devicesadsdasdsa',rfid,fingerprint,password);
    if (!isAuthenticated) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    await Log.create({
      deviceId: device._id,
      action: 'open', // Assuming successful auth means "open" action; adjust as needed
      timeStamp: new Date(),
    });
    res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const userDevices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

  try {
    const user = req.user;
    console.log('bip cmnr',user);
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const devices = await Device.find({ userId: user.userId }); 

    const userDevices = {
      id: user.userId,
      email: user.email,
      name: user.name,
      devices: devices || [], // Return empty array if no devices found
    };

    // Return user details and devices
    res.status(200).json(userDevices);
  } catch (error) {
    console.error('Error in userDevices:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
