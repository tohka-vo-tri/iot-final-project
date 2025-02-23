import { Request, Response } from 'express'; 
import { User } from '@/models/UserModel';

// Thêm fingerprint
export const addFingerprint = async (req: Request, res: Response): Promise<void> => {
  const { email, fingerprint } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }

    await User.updateOne(
      { email },
      { $set: { fingerprint, dateCreateFingerprint: Date.now() } }
    );

    res.status(200).json({ message: 'Fingerprint added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Thêm RFID
export const addRfid = async (req: Request, res: Response): Promise<void> => {
  const { email, rfid } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }

    await User.updateOne(
      { email },
      { $set: { rfid, dateCreateRfid: Date.now() } }
    );

    res.status(200).json({ message: 'RFID added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
