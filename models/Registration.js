const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  customerId: { type: String, required: true, unique: true } // Unique 6-digit customer ID
});

module.exports = mongoose.model('Registration', registrationSchema);