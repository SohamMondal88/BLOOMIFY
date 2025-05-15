const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const orders = require('./routes/orders');
const addresses = require('./routes/addresses');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/orders', orders);
app.use('/api/addresses', addresses);

// Error handler
app.use(errorHandler);

module.exports = app;