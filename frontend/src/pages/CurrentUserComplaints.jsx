import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeftSidebar from '../components/LeftSidebar';
import RightSideBar from '../components/RightSideBar';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const CurrentUserComplaints = () => {
  const [reports, setReports] = useState([]);
  const [location, setLocation] = useState("");

  const fetchReportsByDistrict = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/currentusercomplaints",
        { withCredentials: true } 
      );
      setReports(res.data);
      if (res.data.length > 0) setLocation(res.data[0].location || "");
    } catch (err) {
      console.error("❌ District fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchReportsByDistrict();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <LeftSidebar />
        <main className="flex-1 px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            📍 Your Complaints from:{" "}
            <span className="text-blue-600">{location || "your area"}</span>
          </h1>

          <div className="space-y-4 max-w-3xl mx-auto">
            {reports.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={post.profile_photo || "https://api.dicebear.com/7.x/personas/svg?seed=Citizen"}
                      alt="User"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="text-sm font-medium text-gray-800">
                      {post.name || "Anonymous User"}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
                  <p className="text-gray-700 text-sm mt-1">{post.description}</p>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Evidence"
                      className="mt-3 rounded-md max-h-60 w-full object-cover"
                    />
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    📍 {post.location || "Unknown"} • 🕒{" "}
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <RightSideBar />
      </div>
      <Footer />
    </div>
  );
};

export default CurrentUserComplaints;
