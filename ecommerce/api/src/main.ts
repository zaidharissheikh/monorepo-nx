import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/products';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notifications';
import { initializeSocket } from './socket';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'E-commerce API is running' });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
