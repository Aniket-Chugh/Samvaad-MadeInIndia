import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { isAuthenticated } = useAuth();
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
    profile_photo: "",
    role: "user",
    department: "",
    gov_id: "",
    gov_proof: "",
  });

  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [serverData, setServerData] = useState(null);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

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

    if (name === "profile_photo" || name === "gov_proof") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, [name]: reader.result }));
        };
        reader.readAsDataURL(file); // base64
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
      navigate("/dashboard");
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

          {/* Common Inputs */}
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

          {/* Role Selector */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Registering as
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="user">👤 Normal Citizen</option>
              <option value="government">🏛️ Government Official</option>
            </select>
          </div>

          {/* Extra fields if government */}
          {formData.role === "government" && (
            <>
              <input
                type="text"
                name="department"
                placeholder="Department (e.g., Nagar Nigam)"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="gov_id"
                placeholder="Government ID / Badge Number"
                value={formData.gov_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
              <label className="text-sm text-gray-700 block">
                Upload Government ID Proof
              </label>
              <input
                type="file"
                name="gov_proof"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                className="w-full px-2 py-2 border rounded-md bg-white"
                required
              />
            </>
          )}

          {/* Profile photo */}
          <label className="text-sm text-gray-700 block">Profile Photo</label>
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

          {/* Location */}
          {location.latitude && (
            <p className="text-sm text-gray-600">
              📍 Location:{" "}
              <strong>
                {location.latitude}, {location.longitude}
              </strong>
            </p>
          )}

          {/* Submit */}
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
