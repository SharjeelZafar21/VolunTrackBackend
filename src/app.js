const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const oppRoutes = require('./routes/opportunities');

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', oppRoutes);

app.get('/', (req, res) => {
  res.send('VolunTrack Backend Running');
});

module.exports = app;
