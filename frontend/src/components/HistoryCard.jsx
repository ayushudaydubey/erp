import React, { useState } from 'react';
import dayjs from 'dayjs';
import Card from './ui/Card';
import Button from './ui/Button';
import { formatMinutesToHMS } from '../utils/time';
import { FiCalendar, FiClock, FiCoffee, FiX, FiArrowLeft } from 'react-icons/fi';

const HistoryCard = ({ sessions, history = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Format check-in/out times using dayjs
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return dayjs(timeString).format('hh:mm:ss A');
  };

  // Calculate session duration in minutes and format it
  const getDuration = (checkIn, checkOut) => {
    const start = dayjs(checkIn);
    const end = checkOut ? dayjs(checkOut) : dayjs();
    const diffSeconds = end.diff(start, 'second');
    
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  // Filter history to exclude today's date so we only show past history in the calendar log
  const todayStr = dayjs().format('YYYY-MM-DD');
  const pastHistory = history.filter(item => item.date !== todayStr);

  return (
    <div className="relative">
      <Card className="mt-8 animate-fade-in-up delay-200">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Today's Attendance Sessions
          </h3>
          <Button
            onClick={() => {
              setIsOpen(true);
              setSelectedDay(null);
            }}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FiCalendar className="text-blue-600" />
            History Log
          </Button>
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No check-in activity recorded for today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3 px-4">Check In</th>
                  <th className="pb-3 px-4">Check Out</th>
                  <th className="pb-3 pl-4 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((session, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {formatTime(session.checkIn)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {session.checkOut ? (
                        formatTime(session.checkOut)
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 animate-pulse">
                          Active Now
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pl-4 text-right font-mono font-medium text-slate-800">
                      {getDuration(session.checkIn, session.checkOut)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* History Log Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-slate-200 animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedDay && (
                  <button 
                    onClick={() => setSelectedDay(null)} 
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition mr-1 cursor-pointer"
                  >
                    <FiArrowLeft className="text-xl" />
                  </button>
                )}
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedDay ? 'Daily Attendance Details' : 'Attendance History Calendar'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {!selectedDay ? (
                /* List of Historical Dates */
                pastHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No past attendance records found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastHistory.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => setSelectedDay(item)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <FiCalendar className="text-lg" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block text-sm">
                              {dayjs(item.date).format('dddd, MMMM D, YYYY')}
                            </span>
                            <span className="text-xs text-slate-400">
                              Date: {item.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-3 sm:mt-0 text-xs font-semibold text-slate-500 font-mono">
                          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg">
                            <FiClock className="text-green-500" />
                            Work: {formatMinutesToHMS(item.totalWorkMinutes)}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg">
                            <FiCoffee className="text-amber-500" />
                            Break: {formatMinutesToHMS(item.totalBreakMinutes)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Specific Day Report View */
                <div className="space-y-6">
                  {/* Selected Day Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs font-bold text-slate-400 uppercase block">Total Worked Time</span>
                      <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">
                        {formatMinutesToHMS(selectedDay.totalWorkMinutes)}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">Goal: 8h (480 mins)</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs font-bold text-slate-400 uppercase block">Total Break Time</span>
                      <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">
                        {formatMinutesToHMS(selectedDay.totalBreakMinutes)}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">Accumulated breaks</span>
                    </div>
                  </div>

                  {/* Sessions Table for Selected Day */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Punch Sessions on {dayjs(selectedDay.date).format('MMM D, YYYY')}
                    </h4>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead>
                          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Check In</th>
                            <th className="py-3 px-4">Check Out</th>
                            <th className="py-3 px-4 text-right">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {selectedDay.sessions.map((session, index) => (
                            <tr key={index}>
                              <td className="py-3.5 px-4 font-semibold text-slate-400">{index + 1}</td>
                              <td className="py-3.5 px-4 font-mono">
                                {formatTime(session.checkIn)}
                              </td>
                              <td className="py-3.5 px-4 font-mono">
                                {session.checkOut ? formatTime(session.checkOut) : '-'}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                                {getDuration(session.checkIn, session.checkOut)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setIsOpen(false)} variant="secondary">
                Close
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
