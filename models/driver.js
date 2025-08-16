const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },

  gender: { type: String, enum: ['male', 'female', 'other'] },
  profileImage: { type: String },

  vehicleType: { type: String, enum: ['EV','Auto','Porter'], required: true },
  vehicleNumber: { type: String },

  online: { type: Boolean, default: false },
  lastService: { type: Date },

  earnings: { type: Number, default: 0 },

  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Enable location-based queries
driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
