const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

//Routes
const userRoute = require('./routes/user');
const eventRoute = require('./routes/event');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');

//setup
app.use(morgan('dev'));
app.use(express.json());

// disable cross orgigin resource sharing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // star means it enable for all domains
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//error middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//using routes
app.use('/', userRoute);
app.use('/', eventRoute);
app.use('/', postRoute);
app.use('/', commentRoute);

//connect to database
mongoose.connect(
  'mongodb+srv://Yuri:0106781075@shop-w1yt3.mongodb.net/vc?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

//set up express
app.listen(process.env.PORT || 4000, () => {
  console.log('Listening Now');
});
