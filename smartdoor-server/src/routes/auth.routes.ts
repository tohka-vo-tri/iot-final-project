
// const express = require('express');

import express from 'express';
const router = express.Router();
const authController = require("@/controllers/auth.controller")
router.post('/login',authController.login)
router.post('/register', authController.register);

export default router;