const express = require('express')
const router = express.Router();
const protect = require('../middlewares/authMiddleware') ;
const {authorizeUser}  = require('../middlewares/authUserMiddleware');
const {getBookingHistory} =require('../controllers/HistoryController.js')


router.get('/get-bookings', protect, getBookingHistory)

module.exports = router;