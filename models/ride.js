const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },

  pickup: {
    addr: String,
    lat: Number,
    lng: Number
  },
  drop: {
    addr: String,
    lat: Number,
    lng: Number
  },

  vehicleType: { type: String, enum: ['EV', 'Auto', 'Porter'] },
  distanceKm: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['requested', 'accepted', 'arrived', 'ongoing', 'completed', 'cancelled'],
    default: 'requested'
  },

  otp: { type: String },
  paymentMethod: { type: String, enum: ['cash', 'qr'], default: 'cash' },

  rideStartTime: { type: Date },
  rideEndTime: { type: Date },

  cancellationReason: { type: String },
  userRating: { type: Number, min: 1, max: 5 },
  userFeedback: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
