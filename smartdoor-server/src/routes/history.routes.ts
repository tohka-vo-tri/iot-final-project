import express from 'express';
const router = express.Router();
import { getall,getHistoryById,addHistory } from '@/controllers/history.controller';

router.get('', getall);
router.get('/:userId', getHistoryById);
router.post('/add',addHistory);

export default router;
