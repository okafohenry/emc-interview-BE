'use strict';
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./core');

const authRouter = require('./routes/authentication.routes');
const profileRouter = require('./routes/user.routes');

const app = express();

//Server Security Middlewre
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.MODE === 'development') {
  app.use(logger('dev'));
}

app.all('/', (req, res) => {
  res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .json({
      success: true,
      status: 'success',
      version: '0.0.1',
      server_time: `${new Date()}`,
      data: { ...req.body, ...req.query }
    });
});

app.use('/v1/authentication', authRouter);
app.use('/v1/', profileRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 'Resource Not Found',
    error: '404 Content Do Not Exist Or Has Been Deleted'
  });
});

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.error(err);
  console.log('Node NOT Exiting...'); // Override Grace full exist [EXPERIMENTAL]
});
module.exports = app;
