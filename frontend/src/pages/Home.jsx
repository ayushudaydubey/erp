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
      <Card className="relative overflow-hidden text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 p-6 md:p-8 rounded-2xl shadow-lg border-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-up">
        {/* Decorative blur elements in the background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100 text-sm mt-1.5 font-medium">Keep track of your work hours and breaks today.</p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 text-sm font-semibold">
          {/* Calendar Display */}
          <div className="flex items-center gap-2 bg-white/12 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-xs text-white">
            <FiCalendar className="text-indigo-200 text-base" />
            <span>{dayjs().format('dddd, MMMM D, YYYY')}</span>
          </div>
          {/* Clock Display */}
          <div className="flex items-center gap-2 bg-white/12 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-xs text-white font-mono">
            <FiClock className="text-indigo-200 text-base animate-pulse" />
            <span>{currentTime.format('hh:mm:ss A')}</span>
          </div>
        </div>
      </Card>

      {/* Live Timer Section */}
      <Timer attendance={attendance} currentStatus={currentStatus} />

      {/* Actions (Check In/Out Buttons) Card */}
      <Card className="text-center py-10 border border-slate-200/60 rounded-2xl shadow-xs hover:shadow-sm transition animate-fade-in-up delay-150">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Punch Attendance</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
          {currentStatus === 'checked-in'
            ? 'You are currently clocked in. Press Check Out to complete your session.'
            : currentStatus === 'checked-out'
            ? 'You are currently on break. Press Check In to start a new session.'
            : 'You have not checked in yet today.'}
        </p>

        <div className="flex justify-center gap-5">
          {/* Check In Button */}
          <Button
            onClick={() => checkIn()}
            isLoading={isCheckingIn}
            disabled={currentStatus === 'checked-in' || isCheckingOut}
            className="w-44 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 transition-all text-white border-0"
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
            className="w-44 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95 transition-all text-white border-0"
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
