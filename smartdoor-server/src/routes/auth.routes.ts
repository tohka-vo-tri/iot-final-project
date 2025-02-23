

import express from 'express';
const router = express.Router();
import { login } from '@/controllers/auth.controller';
import { register } from '@/controllers/auth.controller';
import { getallUsers } from '@/controllers/auth.controller';
router.post('/login',login)
router.post('/register', register);
router.get('/users', getallUsers);

export default router;