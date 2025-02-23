import swaggerDocument from '@/configs/swagger-output.json';
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
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
