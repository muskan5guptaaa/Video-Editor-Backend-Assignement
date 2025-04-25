const express = require('express');
const app = express();
const videoRoute = require('./routes/videoRoute');
app.use(express.json());
app.use('/api',videoRoute)
module.exports = app;
