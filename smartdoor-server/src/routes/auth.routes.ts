import { checkDeviceAuth, getallUsers, login, register ,userDevices} from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import express from 'express';

const router = express.Router();
router.post('/login', login)
router.post('/register', register);
router.get('/users', authMiddleware , getallUsers);
router.post('/device', checkDeviceAuth);
router.get('/user', authMiddleware, userDevices);

export default router;