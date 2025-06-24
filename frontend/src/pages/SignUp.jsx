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
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { name, email, phone, password, address, city, state, pincode, role, department, gov_id, gov_proof, profile_photo } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!name || !email || !phone || !password || !address || !city || !state || !pincode || !profile_photo) {
      alert("❌ Please fill all the required fields.");
      return false;
    }

    if (!emailRegex.test(email)) {
      alert("❌ Invalid email format.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      alert("❌ Phone number must be 10 digits.");
      return false;
    }

    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters.");
      return false;
    }

    if (!pincodeRegex.test(pincode)) {
      alert("❌ Invalid pincode format.");
      return false;
    }

    if (role === "government") {
      if (!department || !gov_id || !gov_proof) {
        alert("❌ Please fill all government official fields.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex justify-center items-center py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-4 border-t-8 border-blue-500"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700">Register for Complaint Portal</h2>

          {[{ name: "name", placeholder: "Full Name" }, { name: "email", placeholder: "Email", type: "email" }, { name: "phone", placeholder: "Phone" }, { name: "password", placeholder: "Password", type: "password" }, { name: "address", placeholder: "Address" }, { name: "city", placeholder: "City" }, { name: "state", placeholder: "State" }, { name: "pincode", placeholder: "Pincode" }].map((input) => (
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

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Registering as</label>
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
              <label className="text-sm text-gray-700 block mt-1">Upload Government ID Proof</label>
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

          <label className="text-sm text-gray-700 block">Upload Profile Photo</label>
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
              className="h-24 w-24 object-cover rounded-full mx-auto mt-2 border"
            />
          )}

          {location.latitude && (
            <p className="text-sm text-gray-600 text-center">
              📍 Location: <strong>{location.latitude}, {location.longitude}</strong>
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
