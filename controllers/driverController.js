const Driver = require('../models/driver');
const jwt = require('jsonwebtoken');

/**
 * @desc Get all drivers
 * @route GET /drivers
 */
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Create a new driver
 * @route POST /drivers
 */
exports.createDriver = async (req, res) => {
    try {
        const { name, phone, vehicleType, vehicleNumber } = req.body;
        if (!name || !phone || !vehicleType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const driver = await Driver.create({
            name,
            phone,
            vehicleType,
            vehicleNumber
        });

        res.status(201).json(driver);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc Driver login (mock by phone, no OTP for demo)
 * @route POST /drivers/login
 */
exports.loginDriver = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone is required' });

        const driver = await Driver.findOne({ phone });
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        const token = jwt.sign(
            { id: driver._id, role: 'driver' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ token, driver });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Update driver
 * @route PUT /drivers/:id
 */
exports.updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        res.json(driver);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc Delete driver
 * @route DELETE /drivers/:id
 */
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        res.json({ message: 'Driver deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc Toggle driver availability
 * @route POST /drivers/:id/toggle
 */
exports.toggleAvailability = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        driver.online = !driver.online;
        await driver.save();

        res.json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
