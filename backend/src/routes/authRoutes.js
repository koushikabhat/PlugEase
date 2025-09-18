
const express = require('express'); 
const { sendOtp, verifyOtp } = require('../controllers/authController');
const router =  express.Router();

//auth routes
router.post('/send-otp',sendOtp);

router.post('/verify-otp',verifyOtp);


module.exports = router;    
