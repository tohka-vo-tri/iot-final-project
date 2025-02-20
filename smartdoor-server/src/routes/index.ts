import express from 'express';
import AuthRouter from '@/routes/auth.routes';
import HistoryRouter from '@/routes/history.routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('This is the API root!');
});

router.use('/auth', AuthRouter);
router.use('/history', HistoryRouter);

export default router;
