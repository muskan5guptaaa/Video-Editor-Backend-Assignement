const express = require('express');
const app = express();
const videoRoute = require('./routes/videoRoute');
app.use(express.json());
app.use('/api/videos',videoRoute)
module.exports = app;
