import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/todoRoutes';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use('/api/todos', router);

app.get('/health', (req, res) => {
  res.json({ status: 'Todo service is running!' });
});


export default app;