import React from "react";
import { Link, useLocation } from "react-router-dom";

const LeftSidebar = () => {
  const location = useLocation();


  return (
         <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6 shadow-lg border-r border-gray-200 h-screen sticky top-0">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">📂 Dashboard</h2>
      <nav className="flex-1 space-y-4 text-gray-800 font-medium">
        <Link to="/dashboard/mycomplaints" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition">
          🏠 My Complaints
        </Link>
        <Link to="/dashboard/trending" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-700 transition">
          🔥 Trending
        </Link>
        <Link to="/report" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-green-700 transition">
          ➕ Submit Complaint
        </Link>
        <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition">
          👤 My Profile
        </Link>
        <Link to="/dashboard/support" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-700 transition">
          📞 Support
        </Link>
      </nav>
    </aside>

  );
};

export default LeftSidebar;
