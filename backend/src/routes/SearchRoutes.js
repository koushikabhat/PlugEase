const express = require('express');
const router = express.Router(); 
const protect = require('../middlewares/authMiddleware.js');
const { AddStations, SearchStations, SearchNearBy, BookStation } = require('../controllers/SearchController.js');
   
const {authorizeUser} = require('../middlewares/authUserMiddleware.js');


router.post('/search-stations', protect,authorizeUser("user", "admin", "service-provider"), SearchStations);
router.post('/add-stations', protect,authorizeUser("service-provider","admin") ,AddStations); 
router.post('/search-nearby', protect, SearchNearBy);
router.post('/book-station', protect, BookStation);
module.exports = router;