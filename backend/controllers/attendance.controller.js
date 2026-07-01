const Attendance = require('../models/attendance.model');

// Helper to get local date string YYYY-MM-DD
const getTodayDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

// @desc    Check In
// @route   POST /api/attendance/checkin
// @access  Private
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = getTodayDateString();
    const currentTime = new Date();

    let attendance = await Attendance.findOne({ userId, date: todayStr });

    if (!attendance) {
      // First check-in of the day
      attendance = new Attendance({
        userId,
        date: todayStr,
        sessions: [{ checkIn: currentTime }],
        totalWorkMinutes: 0,
        totalBreakMinutes: 0
      });
      await attendance.save();
      return res.status(200).json({ message: 'Checked in successfully.', attendance });
    }

    // Check if already checked in
    const lastSession = attendance.sessions[attendance.sessions.length - 1];
    if (lastSession && !lastSession.checkOut) {
      return res.status(400).json({ message: 'You are already checked in.' });
    }

    // Calculating Break Time since previous checkout
    let breakMinutes = 0;
    if (lastSession && lastSession.checkOut) {
      const prevCheckOut = new Date(lastSession.checkOut);
      const breakMs = currentTime - prevCheckOut;
      breakMinutes = parseFloat((breakMs / 60000).toFixed(2)); // Store in minutes, keep 2 decimals
    }

    // Add new session and update break minutes
    attendance.sessions.push({ checkIn: currentTime });
    attendance.totalBreakMinutes = parseFloat((attendance.totalBreakMinutes + breakMinutes).toFixed(2));

    await attendance.save();
    return res.status(200).json({ message: 'Checked in successfully.', attendance });
  } catch (error) {
    console.error('Check In Error:', error);
    return res.status(500).json({ message: 'Server error during check in.' });
  }
};

// @desc    Check Out
// @route   POST /api/attendance/checkout
// @access  Private
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = getTodayDateString();
    const currentTime = new Date();

    const attendance = await Attendance.findOne({ userId, date: todayStr });

    if (!attendance || attendance.sessions.length === 0) {
      return res.status(400).json({ message: 'No check-in record found for today.' });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];
    if (lastSession.checkOut) {
      return res.status(400).json({ message: 'You have already checked out.' });
    }

    // Update session checkout time
    lastSession.checkOut = currentTime;

    // Calculate worked minutes for this session
    const checkInTime = new Date(lastSession.checkIn);
    const workMs = currentTime - checkInTime;
    const workMinutes = parseFloat((workMs / 60000).toFixed(2));

    attendance.totalWorkMinutes = parseFloat((attendance.totalWorkMinutes + workMinutes).toFixed(2));

    await attendance.save();
    return res.status(200).json({ message: 'Checked out successfully.', attendance });
  } catch (error) {
    console.error('Check Out Error:', error);
    return res.status(500).json({ message: 'Server error during check out.' });
  }
};

// @desc    Get Today's Attendance
// @route   GET /api/attendance/today
// @access  Private
const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = getTodayDateString();

    const attendance = await Attendance.findOne({ userId, date: todayStr });

    // Return the attendance record (null if not checked in yet)
    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Get Today Attendance Error:', error);
    return res.status(500).json({ message: 'Server error retrieving today\'s attendance.' });
  }
};

// @desc    Get Attendance History (all records)
// @route   GET /api/attendance/history
// @access  Private
const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await Attendance.find({ userId }).sort({ date: -1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error('Get Attendance History Error:', error);
    return res.status(500).json({ message: 'Server error retrieving attendance history.' });
  }
};

// @desc    Get Attendance for a specific Date
// @route   GET /api/attendance/date/:date
// @access  Private
const getAttendanceByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params; // e.g. YYYY-MM-DD
    const attendance = await Attendance.findOne({ userId, date });
    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Get Attendance By Date Error:', error);
    return res.status(500).json({ message: 'Server error retrieving attendance for the specified date.' });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAttendanceByDate
};
