import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayAttendanceApi, checkInApi, checkOutApi, getAttendanceHistoryApi } from '../api/attendanceApi';
import toast from 'react-hot-toast';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  // Query today's attendance record (which is null if not checked in yet)
  const {
    data: attendance,
    isLoading,
    isError,
    refetch: refetchAttendance
  } = useQuery({
    queryKey: ['todayAttendance'],
    queryFn: getTodayAttendanceApi,
    staleTime: 0, // Always retrieve fresh attendance details
  });

  // Query all past attendance logs
  const {
    data: history,
    isLoading: isHistoryLoading,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['attendanceHistory'],
    queryFn: getAttendanceHistoryApi,
    staleTime: 30000, // Cache history list for 30 seconds
  });

  // Check In Mutation
  const checkInMutation = useMutation({
    mutationFn: checkInApi,
    onSuccess: (data) => {
      // Invalidate queries to trigger automatic reload of details and history
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory'] });
      toast.success(data.message || 'Checked in successfully.');
    },
    onError: (error) => {
      // Error toaster is handled centrally by Axios interceptors
    }
  });

  // Check Out Mutation
  const checkOutMutation = useMutation({
    mutationFn: checkOutApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory'] });
      toast.success(data.message || 'Checked out successfully.');
    },
    onError: (error) => {
      // Error toaster is handled centrally by Axios interceptors
    }
  });

  // Determine current status: 'checked-out', 'checked-in', or 'not-started'
  let currentStatus = 'not-started'; // Default state before first check-in
  if (attendance && attendance.sessions && attendance.sessions.length > 0) {
    const lastSession = attendance.sessions[attendance.sessions.length - 1];
    currentStatus = lastSession.checkOut ? 'checked-out' : 'checked-in';
  }

  return {
    attendance: attendance || null,
    history: history || [],
    isLoading: isLoading || isHistoryLoading,
    isHistoryLoading,
    isError,
    currentStatus,
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    checkOut: checkOutMutation.mutate,
    isCheckingOut: checkOutMutation.isPending,
    refetchAttendance,
    refetchHistory
  };
};
