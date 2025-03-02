import { getall ,getbyIdDevice,getbyIdRoom} from '@/controllers/logs.controller';
import express from 'express';
const router = express.Router();

router.get('/getall', getall);
router.get('/getby-idDevice', getbyIdDevice);
router.get('/getby-idRoom', getbyIdRoom);

export default router;
