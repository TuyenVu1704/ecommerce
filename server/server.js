import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const port = process.env.PORT || 8888;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res) => {
  res.send('SERVER ON');
});

app.listen(port, () => {
  console.log('Connect server on port: ' + port);
});
