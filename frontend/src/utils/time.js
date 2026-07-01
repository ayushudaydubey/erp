/**
 * Format minutes (decimal) into HH:MM:SS string
 * @param {number} totalMinutes 
 * @returns {string}
 */
export const formatMinutesToHMS = (totalMinutes) => {
  if (isNaN(totalMinutes) || totalMinutes < 0) return '00:00:00';
  
  const totalSeconds = Math.round(totalMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (num) => String(num).padStart(2, '0');
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Calculates current live attendance times based on sessions
 * @param {Object|null} attendance 
 * @param {string} currentStatus ('checked-in' | 'checked-out' | 'not-started')
 * @returns {Object} { workedMinutes, breakMinutes, remainingMinutes }
 */
export const calculateLiveAttendanceTimes = (attendance, currentStatus) => {
  const DAILY_WORK_GOAL_MINUTES = 480; // 8 Hours

  if (!attendance) {
    return {
      workedMinutes: 0,
      breakMinutes: 0,
      remainingMinutes: DAILY_WORK_GOAL_MINUTES,
    };
  }

  const now = new Date();
  let workedMinutes = attendance.totalWorkMinutes;
  let breakMinutes = attendance.totalBreakMinutes;

  if (currentStatus === 'checked-in') {
    // User is working: calculate ongoing session work time
    const sessions = attendance.sessions;
    if (sessions && sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      const checkInTime = new Date(lastSession.checkIn);
      const diffMs = Math.max(0, now - checkInTime);
      const diffMin = diffMs / 60000;
      workedMinutes += diffMin;
    }
  } else if (currentStatus === 'checked-out') {
    // User is on a break: calculate ongoing break time since last checkout
    const sessions = attendance.sessions;
    if (sessions && sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      const checkOutTime = new Date(lastSession.checkOut);
      const diffMs = Math.max(0, now - checkOutTime);
      const diffMin = diffMs / 60000;
      breakMinutes += diffMin;
    }
  }

  const remainingMinutes = Math.max(0, DAILY_WORK_GOAL_MINUTES - workedMinutes);

  return {
    workedMinutes,
    breakMinutes,
    remainingMinutes,
  };
};
