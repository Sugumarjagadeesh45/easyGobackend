const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const mongoUri = process.env.MONGODB_URI ;

// Remove deprecated options
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });