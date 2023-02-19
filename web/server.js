const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const zip = require('express-easy-zip');

const MONGO_URI = 'mongodb://localhost:27017/cards';

const PORT = process.env.PORT || 3000;

const router = require('./routes/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(zip());

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   next();
// });

app.get('/test', (req, res) => {
  res.json({ message: 'Its nice' });
});

app.use(router);

mongoose.set('strictQuery', true);
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
