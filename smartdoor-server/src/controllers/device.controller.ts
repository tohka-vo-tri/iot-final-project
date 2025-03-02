import { AuthenticatedRequest } from '@/middlewares/auth.middleware';
import { Device ,AuthData} from '@/models/DeviceModel';
import { User } from '@/models/UserModel';
import { Request, Response } from 'express';
const moment = require('moment-timezone');

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
      status: false, 
    createdAt: moment().tz('Asia/Ho_Chi_Minh').toDate(),
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
    if (!device) {
      res.status(404).json({ message: 'Device does not exist' });
      return;
    }
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
      status: false, 
    createdAt: moment().tz('Asia/Ho_Chi_Minh').toDate(),
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
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  const { roomId } = req.params;
  try {
      const device = await Device.findById(roomId);
      if (!device) {
          res.status(404).json({ message: 'Room not found' });
          return;
      }
      await Device.findByIdAndDelete(roomId);
      res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
  const { roomId, deviceId } = req.body;
  try {
    if (!roomId || !deviceId) {
      res.status(400).json({ message: 'Room ID and Device ID are required' });
      return;
    }

    const room = await Device.findById(roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const deviceIndex = room.authData.findIndex(
      (auth: AuthData) => auth.data === deviceId
    );

    if (deviceIndex === -1) {
      res.status(404).json({ message: 'Device not found' });
      return;
    }

    await Device.updateOne(
      { _id: roomId },
      { $pull: { authData: { data: deviceId } } }
    );

    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const updateDevice = async (req: Request, res: Response): Promise<void> => {
  const { nameUser, deviceId, roomId, status } = req.body;

  try {
    if (!nameUser || !deviceId || !roomId) {
      res.status(400).json({ message: 'Name, Device ID, and Room ID are required' });
      return;
    }

    const room = await Device.findById(roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }
    const result = await Device.updateOne(
      { _id: roomId, 'authData.data': deviceId }, 
      { $set: { 'authData.$.name': nameUser } } ,
      { $set: { 'authData.$.status': status } }
    );


    if (result.matchedCount === 0 || result.modifiedCount === 0) {
      res.status(404).json({ message: 'Device not found or no changes made' });
      return;
    }
    res.status(200).json({ message: 'Device updated successfully' });
  } catch (error) {
    console.error('Error updating device:', { nameUser, deviceId, roomId, error });
    res.status(500).json({
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  const{roomId, name} = req.body;
  try{
    const room = await Device.findById(roomId);
    if(!room){
      res.status(404).json({message: "Room not found"});
      return;
    }
    const result = await Device.updateOne({_id: roomId}, {name: name});
    if(result.matchedCount === 0 || result.modifiedCount === 0){
      res.status(404).json({message: "Room not found or no changes made"});
      return;
    }
    res.status(200).json({message: "Room updated successfully"});
  }catch(error){
    res.status(500).json({message: "Server Error", error
    });

  }
};

export const changesPassword = async (req: Request, res: Response): Promise<void> => {};
