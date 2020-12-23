import express from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression  from 'compression ';
import morgan from 'morgan';

import publicRoutes from './src/routes/public';
import apiRoutes from './src/routes/api';
import adminRoutes from './src/routes/admin';
import apiMiddleware from './src/middleware/apiAuth';
import adminMiddleware from './src/middleware/adminAuth';
import errorHandler from './src/middleware/errorHandler';

dotenv.config();
require('./src/config/sequelize');

const app = express();

app.enable('trust proxy');

// Set Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Set Cookie parser
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

//Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  messege: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

//Data sanitization against XSS
app.use(xss());

// Implement CORS
app.use(cors());

app.options('*', cors());

app.use(compression());

app.disable('x-powered-by');

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(bodyParser.json());

app.use('/pub', publicRoutes);
app.use('/api', apiMiddleware, apiRoutes);
app.use('/api/admin', apiMiddleware, adminMiddleware, adminRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

module.exports = app;
