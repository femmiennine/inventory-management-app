import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import { dev } from './config/dev';

connectDB(); // Connect to MongoDB

const app = express();
const PORT = dev.app.port;

// Body parser middleware
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
  console.log('🛑 To stop the server, press CTRL + C');
  await connectDB();
});
