const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const schoolRoutes = require('./routes/schoolRoutes');
const authRoutes = require('./routes/authRoutes');
const academicRoutes = require('./routes/academicRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/schools', schoolRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', academicRoutes);
app.use('/api', resourceRoutes);
app.use('/api', interactionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Morocco Higher Education API',
    endpoints: {
      all_schools: '/schools',
      search: '/schools/search?q=...'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
