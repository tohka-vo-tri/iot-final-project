import express from 'express';
import AuthRouter from '@/routes/auth.routes';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('This is the API root!');
});

router.use('/auth', AuthRouter);

export default router;
