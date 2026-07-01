import api from './axios';

// Check In
export const checkInApi = async () => {
  const response = await api.post('/attendance/checkin');
  return response.data;
};

// Check Out
export const checkOutApi = async () => {
  const response = await api.post('/attendance/checkout');
  return response.data;
};

// Get Today's Attendance Record
export const getTodayAttendanceApi = async () => {
  const response = await api.get('/attendance/today');
  return response.data;
};

// Get All Attendance History Logs
export const getAttendanceHistoryApi = async () => {
  const response = await api.get('/attendance/history');
  return response.data;
};

// Get Attendance Record for a specific date
export const getAttendanceByDateApi = async (date) => {
  const response = await api.get(`/attendance/date/${date}`);
  return response.data;
};
