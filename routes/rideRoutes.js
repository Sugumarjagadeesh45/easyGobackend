const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

// CRUD
router.get('/', rideController.getRides);
router.post('/', rideController.createRide);
router.put('/:id', rideController.updateRide);
router.delete('/:id', rideController.deleteRide);

// Ride lifecycle
router.post('/request', rideController.userAuth, rideController.requestRide);
router.post('/:rideId/accept', rideController.acceptRide);
router.post('/:rideId/arrived', rideController.markArrived);
router.post('/:rideId/start', rideController.startRide);
router.post('/:rideId/complete', rideController.completeRide);

module.exports = router;
