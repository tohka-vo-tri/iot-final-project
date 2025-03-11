import { getall ,getbyIdDevice,getbyIdRoom} from '@/controllers/logs.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import express from 'express';
const router = express.Router();

router.get('/getall',authMiddleware, getall);
router.get('/getby-idDevice',authMiddleware, getbyIdDevice);
router.get('/getby-idRoom',authMiddleware, getbyIdRoom);

export default router;
