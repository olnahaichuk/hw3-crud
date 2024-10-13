import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from '../src/routers/contacts.js';
import { notFoundHandler } from './middlewars/notFoundHandler.js';
import { errorHandler } from './middlewars/errorHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  // app.use(express.json());

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
