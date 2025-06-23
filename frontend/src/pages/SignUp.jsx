import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profile_photo: "", // will hold Base64 string
  });

  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [serverData, setServerData] = useState(null);


if (isAuthenticated == true) {
    navigate("/dashboard");
}

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude.toFixed(8),
          longitude: pos.coords.longitude.toFixed(8),
        });
      },
      (err) => {
        console.warn("Location access denied:", err.message);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_photo") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, profile_photo: reader.result }));
        };
        reader.readAsDataURL(file); // Converts to base64
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`❌ Signup failed: ${data.error || "Unknown error"}`);
        return;
      }

      alert("✅ Signup successful!");
      setServerData(data);
    } catch (error) {
      console.error("Error during signup:", error.message);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

          {[
            { name: "name", placeholder: "Full Name" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "phone", placeholder: "Phone" },
            { name: "password", placeholder: "Password", type: "password" },
            { name: "address", placeholder: "Address" },
            { name: "city", placeholder: "City" },
            { name: "state", placeholder: "State" },
            { name: "pincode", placeholder: "Pincode" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type || "text"}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          ))}

          {/* File upload input */}
          <input
            type="file"
            name="profile_photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-2 py-2 border rounded-md bg-white"
            required
          />

          {formData.profile_photo && (
            <img
              src={formData.profile_photo}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-full mx-auto mt-2"
            />
          )}

          {location.latitude && (
            <p className="text-sm text-gray-600">
              📍 Location:{" "}
              <strong>
                {location.latitude}, {location.longitude}
              </strong>
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>


      </div>
      <Footer />
    </div>
  );
}
