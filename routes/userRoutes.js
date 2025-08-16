
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



// Routes
router.get('/me', userController.authMiddleware, userController.getProfile);
router.get('/wallet', userController.authMiddleware, userController.getWallet);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.post('/register', userController.registerUser);

// 📍 Location APIs
router.post('/location', userController.saveUserLocation);
router.get('/location/last', userController.getLastUserLocation); // latest location
router.get('/location/all', userController.getAllUserLocations); 



module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Routes
// router.get('/me', userController.authMiddleware, userController.getProfile);
// router.get('/wallet', userController.authMiddleware, userController.getWallet);
// router.get('/', userController.getUsers);
// router.post('/', userController.createUser);

// module.exports = router;
