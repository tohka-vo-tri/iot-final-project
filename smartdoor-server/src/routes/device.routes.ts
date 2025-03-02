import { addFingerprint, addNewDevice, addRfid, deleteDevice, deleteRoom, getAllDevices } from '@/controllers/device.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { hmacMiddleware } from '@/middlewares/hmac.middleware';
import express from 'express';

const router = express.Router();
router.put('/add-fingerprint',hmacMiddleware , addFingerprint);
router.put('/add-rfid',hmacMiddleware, addRfid);
router.post('/init-device', authMiddleware, addNewDevice);
router.get('/getall',getAllDevices); 
router.delete('/delete',deleteRoom);
router.delete('/deleteDevice',deleteDevice);

export default router;
