import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { Device ,AuthData} from '@/models/DeviceModel';
import { User } from '@/models/UserModel';
import { Request, Response } from 'express';

type TDeviceRequestBody = {
  name: string;
}

export const addFingerprint = async (req: Request, res: Response): Promise<void> => {
  const { name, fingerprint, deviceId } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ message: 'Device does not exist' });
      return;
    }
    const rfidFingerprint = device.authData && device.authData.some(
      (auth: AuthData) => auth.method === 'Fingerprint' && auth.data === fingerprint
    );
    
    if (rfidFingerprint) {
      res.status(400).json({ message: 'Fingerprint already exists for this device' });
      return;
    }

    const newAuthData: AuthData = {
      method: 'Fingerprint',
      data: fingerprint,
      name :name, 
      createdAt: new Date(),
    };

    device.authData.push(newAuthData);
    await device.save();

    res.status(200).json({ message: 'Fingerprint added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addRfid = async (req: Request, res: Response): Promise<void> => {
  const { name, rfid, deviceId } = req.body;

  try {
    const device = await Device.findById(deviceId);
    console.log("test here sdsdsadsadasdsad",deviceId,name,rfid);
    if (!device) {
      res.status(404).json({ message: 'Device does not exist' });
      return;
    }
    console.log("test here device",device);
    const rfidExists = device.authData && device.authData.some(
      (auth: AuthData) => auth.method === 'RFID' && auth.data === rfid
    );
    
    
    if (rfidExists) {
      res.status(400).json({ message: 'RFID already exists for this device' });
      return;
    }

    const newAuthData: AuthData = {
      method: 'RFID',
      data: rfid,
      name :name, 
      createdAt: new Date(),
    };
    
    device.authData.push(newAuthData);

    await device.save();

    res.status(200).json({ message: 'RFID added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const addNewDevice = async ( req: AuthenticatedRequest & { body: TDeviceRequestBody }, res: Response): Promise<void> => {
  try {
      if (!req.user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
      }
      const { name } = req.body;
      if (!name) {
          res.status(400).json({ message: 'Name is required' });
          return;
      }
      const newDevice = await Device.create({
          userId: req.user.userId,
          name,
      });

      res.status(201).json(newDevice);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

export const getAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
      const devices = await Device.find();
      res.status(200).json(devices.length ? devices : []);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

export const getDeviceDetail = async (req: Request, res: Response): Promise<void> => {
  const { deviceId } = req.params;
  try {
      const device = await Device.findById(deviceId);
      if (!device) {
          res.status(404).json({ message: 'Device not found' });
          return;
      }
      res.status(200).json(device);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};