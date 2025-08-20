const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Test route first
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// ✅ Registered users APIs for admin panel - PUT THESE FIRST
router.get('/registered', userController.getAllRegisteredUsers);
router.get('/registered/:id', userController.getRegisteredUserById);

// Location APIs
router.post('/location', userController.saveUserLocation);
router.get('/location/last', userController.getLastUserLocation);
router.get('/location/all', userController.getAllUserLocations);

// Other existing routes...
router.get('/me', userController.authMiddleware, userController.getProfile);
router.get('/wallet', userController.authMiddleware, userController.getWallet);
router.get('/', userController.getUsers); // This should be LAST
router.post('/', userController.createUser);
router.post('/register', userController.registerUser);

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Routes
// router.get('/me', userController.authMiddleware, userController.getProfile);
// router.get('/wallet', userController.authMiddleware, userController.getWallet);
// router.get('/', userController.getUsers);
// router.post('/', userController.createUser);
// router.post('/register', userController.registerUser);

// // 📍 Location APIs
// router.post('/location', userController.saveUserLocation);
// router.get('/location/last', userController.getLastUserLocation); // latest location
// router.get('/location/all', userController.getAllUserLocations); 

// module.exports = router;