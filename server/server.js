import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect.js';
import { initRoutes } from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
dotenv.config();

const port = process.env.PORT || 8888;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

dbConnect();
initRoutes(app);

app.use('/', (req, res) => {
  res.send('SERVER ON');
});

app.listen(port, () => {
  console.log('Connect server on port: ' + port);
});
