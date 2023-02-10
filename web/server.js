const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb://tarun:ktg2bFu8b3RMsKSf@cluster0-shard-00-00.iy4kk.mongodb.net:27017,cluster0-shard-00-01.iy4kk.mongodb.net:27017,cluster0-shard-00-02.iy4kk.mongodb.net:27017/sampledb?ssl=true&replicaSet=atlas-k2o103-shard-0&authSource=admin&retryWrites=true&w=majority';

const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.get('/test', (req, res) => {
  res.json({ message: 'Its nice' });
});

app.use(authRouter);
app.use(indexRouter);
app.use(postRouter);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    app.listen(PORT, (req, res) => {
      console.log('Running');
    });
  })
  .catch((err) => {
    console.log(err);
  });
