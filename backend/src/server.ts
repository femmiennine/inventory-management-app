import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import { dev } from './config/dev';
import userRouter from './routes/user.route';
import cookieParser from 'cookie-parser';

connectDB(); // Connect to MongoDB

const app = express();
const PORT = dev.app.port;

app.use(cors());
app.use(express.json()); // raw JSON
app.use(express.urlencoded({ extended: true })); // HTML forms
app.use(cookieParser());

// routes
app.use('/api/user', userRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send('Welcome to the Server!');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
  console.log('🛑 To stop the server, press CTRL + C');
  await connectDB();
});
