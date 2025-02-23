

import express from 'express';
const router = express.Router();
const authController = require("@/controllers/auth.controller")
router.post('/login',authController.login)
router.post('/register', authController.register);
router.get('/users', authController.getallUsers);

export default router;