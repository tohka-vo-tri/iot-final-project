import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@/configs/swagger-output.json'; // Import file JSON đã tạo

import router from '@/routes/index';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8000;

import AuthRouter from '@/routes/auth.routes';
import HistoryRouter from '@/routes/history.routes';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);
// app.use('/api/v1/auth', AuthRouter);
// app.use('/api/v1/history', HistoryRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Thêm Swagger UI

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
