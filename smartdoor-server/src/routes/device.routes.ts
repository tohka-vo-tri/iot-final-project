import express from 'express';
import { addFingerprint, addRfid } from '@/controllers/device.controller';

const router = express.Router();

router.put('/add-fingerprint', addFingerprint);
router.put('/add-rfid', addRfid);

export default router;
