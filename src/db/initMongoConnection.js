import mongoose from 'mongoose';
import { env } from '../utils/env.js';

const user = env('MONGODB_USER');
const pwd = env('MONGODB_PASSWORD');
const url = env('MONGODB_URL');
const db = env('MONGODB_DB');

const DB_URI = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
