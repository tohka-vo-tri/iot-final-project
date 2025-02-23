import { addFingerprint, addNewDevice, addRfid } from '@/controllers/device.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();
router.put('/add-fingerprint', addFingerprint);
router.put('/add-rfid', addRfid);
router.post('/init-device', authMiddleware, addNewDevice);

export default router;
