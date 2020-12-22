import express from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import cors from 'cors';
import xss from 'xss-clean';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import publicRoutes from './src/routes/public';
import apiRoutes from './src/routes/api';
import adminRoutes from './src/routes/admin';
import apiMiddleware from './src/middleware/apiAuth';
import adminMiddleware from './src/middleware/adminAuth';
import errorHandler from './src/middleware/errorHandler';

dotenv.config();
require('./src/config/sequelize');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.enable('trust proxy');
// Implement CORS
app.use(cors());

app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  messege: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

app.use('/pub', publicRoutes);
app.use('/api', apiMiddleware, apiRoutes);
app.use('/api/admin', apiMiddleware, adminMiddleware, adminRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
