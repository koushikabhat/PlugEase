const express = require('express');
const { fetchStations, fetchBookings, ActivateStation, fetchCurrentBookings } = require('../controllers/ProviderController');
const router = express.Router();
const protect = require('../middlewares/authMiddleware.js');
const {authorizeUser} = require('../middlewares/authUserMiddleware.js');


router.get('/fetch-station', protect, authorizeUser("service-provider","admin"),fetchStations);
router.get('/fetch-bookings', protect, authorizeUser("service-provider","admin"),fetchBookings);
router.post('/activate-station', protect, authorizeUser("service-provider","admin"), ActivateStation);
router.get ('/fetch-current/bookings', protect, authorizeUser("service-provider","admin"), fetchCurrentBookings);

module.exports = router;