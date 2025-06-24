import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import LeftSidebar from "./LeftSidebar";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [geminiData, setGeminiData] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMLAInfo = async (district, state) => {
    try {
      const res = await axios.post("http://localhost:3000/profile", {
        district,
        state,
      });
      setGeminiData(res.data.result);
    } catch (err) {
      console.error("❌ Gemini API Error:", err.message);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      // PUT call to update user info (create on backend)
      await axios.put("http://localhost:3000/profile/update", formData, {
        withCredentials: true,
      });
      setEditing(false);
      fetchProfile(); // refresh data
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?.district && user?.state) {
      fetchMLAInfo(user.district, user.state);
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <LeftSidebar />

        <main className="flex-1 px-4 py-6">
          {loading ? (
            <div className="text-center py-10">Loading profile...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Profile Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">🧍 Your Profile</h2>
                <input
                  type="text"
                  name="name"
                  disabled={!editing}
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  type="text"
                  name="email"
                  disabled
                  value={formData.email || ""}
                  className="w-full border p-2 mb-2 rounded bg-gray-100"
                />
                <input
                  type="text"
                  name="phone"
                  disabled={!editing}
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full border p-2 mb-2 rounded"
                />
                <div className="flex justify-end gap-2 mt-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-400 text-white px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Verification Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">🔐 Verification</h2>
                <p>
                  📧 Email Verified:{" "}
                  <span className={user.email_verified ? "text-green-600" : "text-red-500"}>
                    {user.email_verified ? "Yes" : "No"}
                  </span>
                </p>
                {!user.email_verified && (
                  <button className="mt-2 text-sm text-blue-600 underline">
                    Send Email Verification
                  </button>
                )}
                <p className="mt-4">
                  📱 Phone Verified:{" "}
                  <span className={user.phone_verified ? "text-green-600" : "text-red-500"}>
                    {user.phone_verified ? "Yes" : "No"}
                  </span>
                </p>
                {!user.phone_verified && (
                  <button className="mt-2 text-sm text-blue-600 underline">
                    Send OTP to Verify Phone
                  </button>
                )}
              </div>

              {/* Political Info */}
              <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">🗳️ Political Info</h2>
                {geminiData ? (
                  <pre className="text-sm whitespace-pre-wrap text-gray-800">{geminiData}</pre>
                ) : (
                  <p className="text-sm text-gray-500">Fetching MLA/MP info...</p>
                )}
              </div>

              {/* Role + Activity Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">📊 Your Stats</h2>
                <p>👤 Role: {user.role}</p>
                <p>📍 Location: {user.city}, {user.state}</p>
                <p>📢 Total Complaints: {user.complaints?.length || 0}</p>
                <p>
                  🏅 Activity Level:{" "}
                  {user.complaints?.length > 20
                    ? "🔥 Very Active"
                    : user.complaints?.length > 10
                    ? "👍 Active"
                    : user.complaints?.length > 0
                    ? "📈 New Contributor"
                    : "🕊️ Just Started"}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
