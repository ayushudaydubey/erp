import React from 'react';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'min-h-screen bg-slate-50' : 'p-8'}`}>
      {/* Blue spinner animation */}
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 text-sm mt-4 font-medium">Loading, please wait...</p>
    </div>
  );
};

export default Loader;
