import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";

const MakeReport = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Auto-location on mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        const loc = await reverseGeocode(lat, lon);
        setLocation(loc);
      },
      () => alert("⚠️ Location access denied."),
      { enableHighAccuracy: true }
    );
  }, []);

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      return data.display_name || "Unknown Location";
    } catch {
      return "Unknown Location";
    }
  };

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    });
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const capturePhoto = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setPhoto(dataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !description || !category || !photo) {
    return alert("⚠️ All fields are required including category and image.");
  }
  setLoading(true);

  try {
    const payload = {
      title,
      description,
      category,
      image_url: photo,
      latitude,
      longitude,
      location,
    };

    const res = await axios.post("http://localhost:3000/report", payload, {
      withCredentials: true, // ✅ this sends cookies like JWT
    });

    if (res.data.image_status === "VALID") {
      alert(`✅ Complaint submitted successfully!
Priority: ${res.data.priority}
Image Authenticity: ${res.data.image_status}`);
      setTitle("");
      setDescription("");
      setCategory("");
      setPhoto(null);
    } else {
      alert(`⚠️ Complaint Rejected!
Image Issue: ${res.data.image_status}`);
    }
  } catch (err) {
    console.error(err);
    if (err.response?.status === 401) {
      alert("🔒 You must be logged in to submit a report. Please login or sign up.");
      // Optional: redirect to login
      // navigate("/signup"); // only if you import useNavigate and use it
    }
    if (err.response?.data?.error?.includes("Image check failed")) {
      alert(`❌ Image Issue: ${err.response.data.error}`);
    } else {

      alert("❌ Unexpected error while submitting report.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavBar />

      <div className="p-6 container mx-auto space-y-8 animate-fade-in">
        <h1 className="text-4xl text-center font-bold text-orange-500">
          Submit a Report
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl space-y-4"
        >
          <input
            type="text"
            placeholder="Title (e.g. बिजली की समस्या)"
            className="w-full p-3 rounded bg-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            rows={4}
            placeholder="Description (e.g. यहाँ 3 दिन से लाइट नहीं है)"
            className="w-full p-3 rounded bg-gray-700"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Category Dropdown with animation */}
          <div className="relative group">
            <label className="block text-sm mb-1">Category</label>
            <select
              className="w-full p-3 rounded bg-gray-700 text-white transition-all duration-300 group-hover:ring-2 group-hover:ring-orange-500 focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Fire">🔥 Fire</option>
              <option value="Flood">🌊 Flood</option>
              <option value="Road Block">🛑 Road Block</option>
              <option value="Electricity Issue">⚡ Electricity</option>
              <option value="Water Leakage">🚰 Water Leakage</option>
              <option value="Garbage">🗑 Garbage</option>
            </select>
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm mb-1">Upload Photo (Only 1)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="text-white"
            />
          </div>

          {/* Camera */}
          <section className="mt-4 space-y-2">
            <video
              ref={videoRef}
              width="320"
              height="240"
              autoPlay
              className="rounded shadow"
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{ display: "none" }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="bg-purple-600 px-4 py-2 rounded"
              >
                Start Camera
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Stop
              </button>
            </div>
          </section>

          {/* Preview */}
          {photo && (
            <div className="mt-2">
              <img src={photo} alt="Preview" className="rounded shadow-md" />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="mt-2 bg-black px-3 py-1 rounded text-white"
              >
                ❌ Remove Photo
              </button>
            </div>
          )}

          {/* Location */}
          <p className="text-sm italic mt-2">📍 {location}</p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded text-lg"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default MakeReport;
