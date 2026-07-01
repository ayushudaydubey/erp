import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">Attendance Portal</span>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm font-medium text-slate-600">
              Hello, <span className="font-semibold text-slate-800">{user.name}</span>
            </span>
          )}
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
