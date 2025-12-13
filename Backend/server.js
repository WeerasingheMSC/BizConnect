import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1', (await import('./src/routers/userRouter.js')).default);

// Connect to MongoDB
connectDB();

//connecting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});