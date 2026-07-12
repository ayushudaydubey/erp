const cron = require('node-cron');
const Attendance = require('../models/attendance.model');

/**
 * Calculates the local date string (YYYY-MM-DD) for Monday of the current week.
 * Assumes Monday is the first day of the working week.
 * If today is Sunday, the current week's Monday is 6 days ago.
 */
const getMondayDateString = () => {
  const d = new Date();
  const day = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  // We want to find the Monday of the current week.
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d.setDate(diff));
  
  // Format to YYYY-MM-DD in local time
  const offset = monday.getTimezoneOffset();
  const localMonday = new Date(monday.getTime() - (offset * 60 * 1000));
  return localMonday.toISOString().split('T')[0];
};

/**
 * Deletes all attendance records with a date prior to the current week's Monday.
 */
const cleanOldAttendance = async () => {
  try {
    const mondayStr = getMondayDateString();
    console.log(`[Cleanup] Scanning database for records older than Monday (${mondayStr})...`);
    const result = await Attendance.deleteMany({ date: { $lt: mondayStr } });
    if (result.deletedCount > 0) {
      console.log(`[Cleanup] Successfully deleted ${result.deletedCount} old attendance records.`);
    } else {
      console.log('[Cleanup] No old attendance records found to delete.');
    }
  } catch (error) {
    console.error('[Cleanup] Error during database cleanup:', error);
  }
};

/**
 * Initializes and schedules the cleanup job.
 */
const initCleanupJob = () => {
  // Run cleanup once on server startup to handle offline gaps
  cleanOldAttendance();

  // Schedule to run daily at midnight (00:00)
  // '0 0 * * *' matches everyday at 00:00
  cron.schedule('0 0 * * *', () => {
    console.log('[Cleanup] Running scheduled daily database cleanup...');
    cleanOldAttendance();
  });
  console.log('[Cleanup] Database cleanup cron job scheduled (daily at midnight).');
};

module.exports = {
  cleanOldAttendance,
  initCleanupJob,
  getMondayDateString
};
