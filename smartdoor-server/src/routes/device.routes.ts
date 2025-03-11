import { addFingerprint, addNewDevice, addRfid, deleteDevice, deleteRoom, getAllDevices, updateDevice,updateRoom,changesPassword, addPassword } from '@/controllers/device.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { hmacMiddleware } from '@/middlewares/hmac.middleware';

import express from 'express';

const router = express.Router();
router.put('/add-fingerprint',hmacMiddleware , addFingerprint);
router.put('/add-rfid',hmacMiddleware, addRfid);
router.post('/init-device', authMiddleware, addNewDevice);
router.get('/getall',authMiddleware,getAllDevices); 
router.delete('/delete',authMiddleware,deleteRoom);
router.delete('/delete-device',authMiddleware,deleteDevice);
router.put('/update-device',authMiddleware,updateDevice);
router.put('/changes-password',changesPassword);
router.put('/update-room',authMiddleware,updateRoom);
router.put('/add-password',authMiddleware,addPassword);
export default router;
