import swaggerDocument from 'swagger-output.json';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import connectDB from './configs/database.config';

import router from '@/routes/index';
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT ?? 8000;
const allowedOrigins: string[] = ['http://localhost:3000'];
const frontendUrl: string = process.env.FRONTEND_URL ?? '';
if (frontendUrl.length > 0) {
  allowedOrigins.push(frontendUrl);
}
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
