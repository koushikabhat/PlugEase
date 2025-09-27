const express = require('express');
const router = express.Router(); 
const protect = require('../middlewares/authMiddleware.js');
const { AddStations, SearchStations } = require('../controllers/SearchController.js');
   
const {authorizeUser} = require('../middlewares/authUserMiddleware.js');


router.post('/search-stations', protect,authorizeUser("user", "admin"), SearchStations);
router.post('/add-stations', protect,authorizeUser("service-provider","admin") ,AddStations); 

module.exports = router;