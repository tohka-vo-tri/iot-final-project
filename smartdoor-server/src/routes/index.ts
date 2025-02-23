import AuthRouter from '@/routes/auth.routes';
import DeviceRouter from '@/routes/device.routes';
import HistoryRouter from '@/routes/logs.routes';
import express from 'express';
const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/logs', HistoryRouter);
router.use('/devices', DeviceRouter);

export default router;
