const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getTodayAttendance, getAttendanceHistory, getAttendanceByDate } = require('../controllers/attendance.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/today', protect, getTodayAttendance);
router.get('/history', protect, getAttendanceHistory);
router.get('/date/:date', protect, getAttendanceByDate);

module.exports = router;
