import { addFingerprint, addNewDevice, addRfid ,getAllDevices,deleteRoom,deleteDevice} from '@/controllers/device.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { get } from 'axios';
import express from 'express';

const router = express.Router();
router.put('/add-fingerprint', addFingerprint);
router.put('/add-rfid', addRfid);
router.post('/init-device', authMiddleware, addNewDevice);
router.get('/getall',getAllDevices); 
router.delete('/delete',deleteRoom);
router.delete('/deleteDevice',deleteDevice);

export default router;
