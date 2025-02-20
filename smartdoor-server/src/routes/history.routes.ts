import express from 'express';
const router = express.Router();
const historyController = require("@/controllers/history.controller")

router.get('', historyController.getall);
router.get('/:userId', historyController.getHistoryById);
router.post('/add', historyController.addHistory);

export default router;
