import React, { useState, useEffect } from 'react';
import { calculateLiveAttendanceTimes, formatMinutesToHMS } from '../utils/time';
import Card from './ui/Card';
import { FiClock, FiCoffee } from 'react-icons/fi';

const Timer = ({ attendance, currentStatus }) => {
  const [times, setTimes] = useState(() =>
    calculateLiveAttendanceTimes(attendance, currentStatus)
  );

  useEffect(() => {
    // Initial evaluation when dependencies change
    setTimes(calculateLiveAttendanceTimes(attendance, currentStatus));

    // If no session started yet, don't run a ticking interval
    if (currentStatus === 'not-started') {
      return;
    }

    // Tick local timer every second
    const interval = setInterval(() => {
      setTimes(calculateLiveAttendanceTimes(attendance, currentStatus));
    }, 1000);

    return () => clearInterval(interval);
  }, [attendance, currentStatus]);

  // Determine Worked Percent relative to 8 hours target (480 minutes)
  const DAILY_GOAL_MINUTES = 480;
  const workedPercent = Math.min(100, (times.workedMinutes / DAILY_GOAL_MINUTES) * 100);

  // SVG circular properties
  const radius = 85;
  const circumference = 2 * Math.PI * radius; // 534.07
  const strokeDashoffset = circumference - (workedPercent / 100) * circumference;

  // Determine progress stroke color based on percentage
  const getProgressColor = (percent) => {
    if (percent === 0) return '#cbd5e1'; // slate-300 (colorless)
    if (percent < 25) return '#93c5fd'; // blue-300 (light sky blue)
    if (percent < 50) return '#60a5fa'; // blue-400 (medium blue)
    if (percent < 75) return '#3b82f6'; // blue-500 (standard blue)
    if (percent < 100) return '#2563eb'; // blue-600 (vibrant brand blue)
    return '#10b981'; // emerald-500 (target achieved!)
  };

  // Determine status color classes
  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'checked-in':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 animate-pulse">
            Working
          </span>
        );
      case 'checked-out':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            On Break
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            Not Checked In
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-fade-in-up delay-100">
      {/* Main Dashboard Card with Circular Timer */}
      <Card className="lg:col-span-2 flex flex-col md:flex-row items-center justify-around p-8 border-l-4 border-l-blue-600">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center w-52 h-52 animate-pulse-glow">
            {/* SVG Progress Ring */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background Track Circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                strokeWidth="10"
                stroke="#f1f5f9" // slate-100 track
                fill="transparent"
              />
              {/* Foreground Animated Progress Circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                strokeWidth="10"
                stroke={getProgressColor(workedPercent)}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Centered Stats inside circular timer */}
            <div className="text-center z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Worked Today</span>
              <div className="text-3xl font-extrabold text-slate-800 font-mono mt-1">
                {formatMinutesToHMS(times.workedMinutes)}
              </div>
              <span className="text-sm font-semibold text-blue-600 mt-1 block">
                {workedPercent.toFixed(1)}% Done
              </span>
            </div>
          </div>
        </div>

        {/* Text Details & Progression Bar */}
        <div className="mt-6 md:mt-0 space-y-6 flex-grow max-w-sm md:pl-8">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</h3>
            <div className="mt-2 flex items-center gap-3">
              {getStatusBadge()}
              <span className="text-sm font-medium text-slate-600">
                {currentStatus === 'checked-in' ? 'Clocked in and working' : currentStatus === 'checked-out' ? 'Checked out / On break' : 'Shift not started'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Progress Goal</h3>
            <div className="mt-2 flex justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>0h</span>
              <span>Goal: 8 Hours (480 min)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${workedPercent}%`,
                  backgroundColor: getProgressColor(workedPercent)
                }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Column 3: Secondary Stats Stack */}
      <div className="space-y-6 flex flex-col justify-between">
        {/* Break Card */}
        <Card className="flex-1 flex items-center gap-4 border-l-4 border-l-amber-500 p-6 h-full hover:shadow-md transition">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <FiCoffee className="text-2xl" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Break Time</span>
            <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">
              {formatMinutesToHMS(times.breakMinutes)}
            </div>
            {currentStatus === 'checked-out' ? (
              <span className="text-xs font-semibold text-amber-600 animate-pulse mt-0.5 block">Ticking break...</span>
            ) : (
              <span className="text-xs text-slate-400 mt-0.5 block">Accumulated Today</span>
            )}
          </div>
        </Card>

        {/* Remaining Card */}
        <Card className="flex-1 flex items-center gap-4 border-l-4 border-l-emerald-500 p-6 h-full hover:shadow-md transition">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <FiClock className="text-2xl" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Remaining Time</span>
            <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">
              {formatMinutesToHMS(times.remainingMinutes)}
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">Until 8 Hours target</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Timer;
