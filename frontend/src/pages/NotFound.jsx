import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
      <p className="text-slate-600 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
