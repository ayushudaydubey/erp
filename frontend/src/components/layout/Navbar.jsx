import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiClock, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
            <FiClock className="text-lg animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
            Attendance Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            /* Styled User Name Badge/Avatar Pill */
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-inner">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user.name}</span>
            </div>
          )}

          {/* Logout Action Button */}
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full border border-slate-200 hover:border-red-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <FiLogOut className="text-sm" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
