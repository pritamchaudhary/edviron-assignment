require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// --- Connect to Database ---
connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);

// --- Basic Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));