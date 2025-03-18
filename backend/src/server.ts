import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Body parser middleware
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
