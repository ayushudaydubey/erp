const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  }
}, { _id: false }); // Disable _id for session sub-documents to keep it simple

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Stored in YYYY-MM-DD format
    required: true
  },
  sessions: [sessionSchema],
  totalWorkMinutes: {
    type: Number,
    default: 0
  },
  totalBreakMinutes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to quickly find a user's attendance for a specific date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
