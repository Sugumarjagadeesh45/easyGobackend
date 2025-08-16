const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.get('/', driverController.getDrivers);
router.post('/', driverController.createDriver);
router.post('/login', driverController.loginDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);
router.post('/:id/toggle', driverController.toggleAvailability);

module.exports = router;
