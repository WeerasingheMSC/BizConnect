import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', (await import('./src/routers/authRouter.js')).default);
app.use('/api/v1/user', (await import('./src/routers/userRouter.js')).default);
app.use('/api/v1/business', (await import('./src/routers/businessRouter.js')).default);
app.use('/api/v1/meta', (await import('./src/routers/metaRouter.js')).default);

// Connect to MongoDB
connectDB();

// Health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

//connecting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});