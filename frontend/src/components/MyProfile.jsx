import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import LeftSidebar from "./LeftSidebar";
import RightSideBar from "./RightSideBar";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [location, setLocation] = useState("");

  const fetchProfileData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });

      console.log("📦 Fetched profile data:", res.data);

      if (res.data) {
        setUser(res.data); // Set full user object
        setLocation(`${res.data.city}, ${res.data.state}`);
        if (res.data.complaints) {
          setComplaints(res.data.complaints); // If you're sending complaints separately
        }
      }
    } catch (err) {
      console.error("❌ Profile fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <LeftSidebar />

        <main className="flex-1 px-4 py-6">
          {/* Profile Header */}
          {user && (
            <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={
                    user.profile_photo ||
                    "https://api.dicebear.com/7.x/personas/svg?seed=Citizen"
                  }
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-blue-600 object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">{user.phone}</p>
                  <p className="text-gray-600">📍 {location}</p>
                </div>
              </div>
            </div>
          )}

         
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
