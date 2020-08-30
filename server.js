const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');

dotenv.config();

connectDB();
const bootcamps = require('./routes/bootcamps');


const { PORT, NODE_ENV } = process.env;
const port = PORT || 5000;
const ROOT = '/api/v1'

const app = express();
app.use(express.json());

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));  
}
app.use(`${ROOT}/bootcamps`, bootcamps);


const server = app.listen(port, console.log(`Server running in ${NODE_ENV} mode on port ${port}`.cyan.bold));

// unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err}`.red.bold);
  server.close(() => process.exit(1))
});