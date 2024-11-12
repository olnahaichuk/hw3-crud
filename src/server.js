import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routers/index.js';
import { notFoundHandler } from './middlewars/notFoundHandler.js';
import { errorHandler } from './middlewars/errorHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewars/swaggerDocs.js';
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use('/api-docs', swaggerDocs());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('uploads', express.static(UPLOAD_DIR));

  app.use('/', routes);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
