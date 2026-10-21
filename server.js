require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db/db.js');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Enables reading/writing cookie tokens safely

// Mount API Routes
app.use('/api/v1/auth', authRoutes);

app.use('/', (req, res) => {
  res.send('Admin Panel System Running Smoothly');
});

app.listen(PORT, () => {
  console.log(`Professional Server listening on http://localhost:${PORT}`);
});
