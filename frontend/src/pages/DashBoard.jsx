import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import LeftSidebar from "../components/LeftSidebar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const navigate = useNavigate();

  const fetchReportsByDistrict = async (location) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/bydistrict",
        { location },
        { withCredentials: true }
      );
      console.log("📦 Reports fetched:", res.data);
      setReports(res.data.complaints);
      setUserName(res.data.user);
    } catch (err) {
      console.error("District fetch failed:", err);
      if (err.response && err.response.status === 401) {
        navigate("/signup");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          setLocation(geoData.display_name);
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      },
      (err) => {
        console.warn("Location error:", err.message);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      console.log("📍 Updated location:", location);
      fetchReportsByDistrict(location);
    }
  }, [location]);

  const handleVote = async (id, type) => {
    try {
      await axios.post(
        "http://localhost:3000/voting",
        {
          complaint_id: id,
          type: type,
        },
        { withCredentials: true }
      );
      fetchReportsByDistrict(location);
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  const uploadtime = (time) => {
    return new Date(time).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        <LeftSidebar />
        <main className="flex-1 px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            📍 Hi , <span className="text-blue-600">{userName}</span> Complaints from:{" "}
            <span className="text-blue-600">{location || "your area"}</span>
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {reports.map((post, index) => (
                <div
                  key={post.id || index}
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
                        {post.user_id || "Anonymous User"}
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {post.priority}
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
                      📍 {post.location || "Unknown"} • 🕒 {uploadtime(post.submitted_at)}
                    </div>

                    <button
                      onClick={() =>
                        setShowComments({
                          ...showComments,
                          [post.id]: !showComments[post.id],
                        })
                      }
                      className="text-sm text-blue-500 mt-2"
                    >
                      💬 {showComments[post.id] ? "Hide Comments" : "Show Comments"}
                    </button>

                    {showComments[post.id] && (
                      <div className="mt-2 border-t pt-3 space-y-2">
                        {(post.comments || []).map((c, i) => (
                          <div
                            key={i}
                            className="text-sm bg-gray-100 rounded p-2"
                          >
                            <p className="text-gray-800">{c.comment}</p>
                          </div>
                        ))}

                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            className="border rounded px-2 py-1 text-sm flex-1"
                            value={commentInputs[post.id]?.comment || ""}
                            onChange={(e) =>
                              setCommentInputs({
                                ...commentInputs,
                                [post.id]: {
                                  comment: e.target.value,
                                },
                              })
                            }
                          />
                          <button
                            onClick={() => {
                              const current = commentInputs[post.id];
                              if (!current?.comment) {
                                alert("Write a comment");
                                return;
                              }
                              const newComment = {
                                comment: current.comment,
                                posted_at: new Date(),
                              };
                              const updated = reports.map((r) =>
                                r.id === post.id
                                  ? {
                                      ...r,
                                      comments: [
                                        ...(r.comments || []),
                                        newComment,
                                      ],
                                    }
                                  : r
                              );
                              setReports(updated);
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: { comment: "" },
                              }));
                            }}
                            className="bg-blue-600 text-white text-sm px-4 py-1 rounded"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
