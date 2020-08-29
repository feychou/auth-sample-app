const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
const bootcamps = require('./routes/bootcamps');


const { PORT, NODE_ENV } = process.env;
const port = PORT || 5000;
const ROOT = '/api/v1'

const app = express();
app.use(`${ROOT}/bootcamps`, bootcamps);


app.listen(port, console.log(`Server running in ${NODE_ENV} mode on port ${port}`));