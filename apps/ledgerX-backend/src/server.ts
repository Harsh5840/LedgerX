import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';

import './config/passport'; // ✅ This initializes passport strategies
import routes from './routes';

dotenv.config();

const app = express();

// 🔐 CORS config
const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(passport.initialize()); // ✅ AFTER importing strategies

// 🚀 API routes
app.use('/api', routes);

// ❌ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ❗ Global error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🎯 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  });
