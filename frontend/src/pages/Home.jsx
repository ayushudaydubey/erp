import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../hooks/useAuth';
import { useAttendance } from '../hooks/useAttendance';
import Timer from '../components/Timer';
import HistoryCard from '../components/HistoryCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/common/Loader';
import { FiClock, FiLogIn, FiLogOut, FiCalendar } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const {
    attendance,
    history,
    isLoading,
    currentStatus,
    checkIn,
    isCheckingIn,
    checkOut,
    isCheckingOut
  } = useAttendance();

  // Clock state for displaying current live time
  const [currentTime, setCurrentTime] = useState(() => dayjs());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Date/Time Info Header Card */}
      <Card className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Keep track of your work hours and breaks today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm font-medium text-slate-600">
          {/* Calendar Display */}
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm">
            <FiCalendar className="text-blue-500 text-base" />
            <span>{dayjs().format('dddd, MMMM D, YYYY')}</span>
          </div>
          {/* Clock Display */}
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm font-mono">
            <FiClock className="text-blue-500 text-base animate-pulse" />
            <span>{currentTime.format('hh:mm:ss A')}</span>
          </div>
        </div>
      </Card>

      {/* Live Timer Section */}
      <Timer attendance={attendance} currentStatus={currentStatus} />

      {/* Actions (Check In/Out Buttons) Card */}
      <Card className="text-center py-8 animate-fade-in-up delay-150">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Punch Attendance</h2>
        <p className="text-slate-500 text-sm mb-6">
          {currentStatus === 'checked-in'
            ? 'You are currently clocked in. Press Check Out to complete your session.'
            : currentStatus === 'checked-out'
            ? 'You are currently on break. Press Check In to start a new session.'
            : 'You have not checked in yet today.'}
        </p>

        <div className="flex justify-center gap-4">
          {/* Check In Button */}
          <Button
            onClick={() => checkIn()}
            isLoading={isCheckingIn}
            disabled={currentStatus === 'checked-in' || isCheckingOut}
            className="w-40"
          >
            <FiLogIn className="text-base" />
            Check In
          </Button>

          {/* Check Out Button */}
          <Button
            onClick={() => checkOut()}
            variant="danger"
            isLoading={isCheckingOut}
            disabled={currentStatus !== 'checked-in' || isCheckingIn}
            className="w-40"
          >
            <FiLogOut className="text-base" />
            Check Out
          </Button>
        </div>
      </Card>

      {/* History Log Card */}
      <HistoryCard sessions={attendance?.sessions} history={history} />
    </div>
  );
};

export default Home;
