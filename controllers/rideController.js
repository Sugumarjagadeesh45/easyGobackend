const User = require('../models/User');
const Driver = require('../models/driver');
const Ride = require('../models/ride');
const jwt = require('jsonwebtoken');

// --- Auth middleware ---
exports.userAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = data;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Helpers ---
function calculateFare(distanceKm, vehicleType) {
  const base = vehicleType === 'EV' ? 15 : (vehicleType === 'Auto' ? 10 : 12);
  const price = Math.max(50, Math.round(base * distanceKm));
  const points = Math.round(distanceKm * 5);
  return { price, points };
}

// --- CRUD ---
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('driver').populate('user');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createRide = async (req, res) => {
  console.log('📥 Incoming ride request body:', req.body);

  try {
    const ride = new Ride(req.body);
    await ride.save();

    console.log('✅ Ride saved:', ride);
    res.status(201).json(ride);
  } catch (err) {
    console.error('❌ Error saving ride:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRide = async (req, res) => {
  try {
    await Ride.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ride deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Ride Lifecycle ---
exports.requestRide = async (req, res) => {
  const { pickup, drop, distanceKm = 1, vehicleType = 'EV', paymentMethod = 'cash' } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { price, points } = calculateFare(distanceKm, vehicleType);
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const ride = await Ride.create({
    user: user._id,
    pickup, drop,
    distanceKm,
    price,
    pointsEarned: points,
    status: 'requested',
    otp,
    paymentMethod
  });

  console.log(`Ride ${ride._id} OTP: ${otp}`);
  res.json({ ride, message: 'Ride requested successfully' });
};

exports.acceptRide = async (req, res) => {
  const { driverId } = req.body;
  const ride = await Ride.findById(req.params.rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  if (ride.status !== 'requested') return res.status(400).json({ error: 'Ride already taken' });

  ride.driver = driverId;
  ride.status = 'accepted';
  await ride.save();

  res.json({ ride });
};

exports.markArrived = async (req, res) => {
  const ride = await Ride.findById(req.params.rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  ride.status = 'arrived';
  await ride.save();

  res.json({ ride });
};

exports.startRide = async (req, res) => {
  const { otp } = req.body;
  const ride = await Ride.findById(req.params.rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  if (ride.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  ride.status = 'ongoing';
  await ride.save();

  res.json({ ride });
};

exports.completeRide = async (req, res) => {
  const ride = await Ride.findById(req.params.rideId).populate('user driver');
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  ride.status = 'completed';
  await ride.save();

  const user = await User.findById(ride.user._id);
  user.wallet.points = (user.wallet.points || 0) + (ride.pointsEarned || 0);
  await user.save();

  if (ride.driver) {
    const driver = await Driver.findById(ride.driver._id);
    driver.earnings = (driver.earnings || 0) + ride.price;
    await driver.save();
  }

  res.json({ ride, newUserPoints: user.wallet.points });
};
