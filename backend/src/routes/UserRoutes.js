const express = require('express');
const {updateUser , GetProfile} = require('../controllers/UserControllers');
const protect = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/get-profile', protect, GetProfile);
router.put('/update-user', protect, updateUser)

module.exports = router;