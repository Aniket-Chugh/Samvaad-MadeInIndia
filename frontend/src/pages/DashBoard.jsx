import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import LeftSidebar from "../components/LeftSidebar";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [location, setLocation] = useState("");

  // Fetch complaints based on location
  const fetchReportsByDistrict = async (location) => {
    try {
      const res = await axios.post("http://localhost:3000/bydistrict", { location },  { withCredentials: true }
);
      console.log("📦 Reports fetched:", res.data);
      setReports(res.data);
    } catch (err) {
      console.error("District fetch failed:", err);
    }
  };

  // Reverse geocode to get location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          setLocation(geoData.display_name); // 📍 Set full address string
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      },
      (err) => {
        console.warn("Location error:", err.message);
      }
    );
  }, []);

  // Trigger fetch when location is updated
  useEffect(() => {
    if (location) {
      console.log("📍 Updated location:", location);
      fetchReportsByDistrict(location);
    }
  }, [location]);

  const handleVote = async (id, type) => {
    try {
      await axios.post("http://localhost:3000/voting", {
        complaint_id: id,
        type: type,
      });
      fetchReportsByDistrict(location); // Refresh after vote
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <LeftSidebar />
        <main className="flex-1 px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            📍 Complaints from:{" "}
            <span className="text-blue-600">
              {location || "your area"}
            </span>
          </h1>

          <div className="space-y-4 max-w-3xl mx-auto">
            {reports.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex sm:flex-col items-center justify-between sm:justify-center text-center">
                  <button
                    onClick={() => handleVote(post.id, "upvote")}
                    className="text-xl text-green-600 hover:scale-110"
                  >
                    ↑
                  </button>
                  <span className="font-semibold text-sm">
                    {(post.upvote || 0) - (post.downvote || 0)}
                  </span>
                  <button
                    onClick={() => handleVote(post.id, "downvote")}
                    className="text-xl text-red-600 hover:scale-110"
                  >
                    ↓
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={
                        post.profile_photo ||
                        "https://api.dicebear.com/7.x/personas/svg?seed=Citizen"
                      }
                      alt="User"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="text-sm font-medium text-gray-800">
                      {post.name || "Anonymous User"}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    {post.title}
                  </h2>
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

        <aside className="hidden lg:block w-72 bg-white p-4 shadow h-screen sticky top-0">
          <h2 className="text-xl font-semibold mb-4">📢 Tips</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Use clear titles for your complaints.</li>
            <li>📷 Attach real photos for verification.</li>
            <li>🌐 Enable location for accuracy.</li>
            <li>🏅 Earn badges with trusted reports.</li>
          </ul>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
