import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'
import router from './route';
import errorMiddleware from './middleware/error.middleware';

dotenv.config();

const PORT: number | string | undefined = process.env.API_PORT || 5000;
const DB_URL: string | undefined = process.env.DB_URL;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(DB_URL as string);
    app.listen(PORT, () => {
      console.log(`Server has been started on ${PORT} port`);
    })
  } catch(e) {
    console.log(e);
  }
}

start();