import { getall } from '@/controllers/logs.controller';
import express from 'express';
const router = express.Router();

router.get('/', getall);

export default router;
