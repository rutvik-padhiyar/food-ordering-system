// Filename: Signup.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    address: "", // NEW FIELD
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ⭐ CURRENT LOCATION FETCH FUNCTION
  const fetchLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // ⭐ Reverse Geocoding (Convert lat-long → Address)
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          const fullAddress = data.display_name || "Address not found";

          // Set address in input
          setFormData((prev) => ({ ...prev, address: fullAddress }));
        } catch (err) {
          alert("Failed to fetch address");
        }

        setLoading(false);
      },
      () => {
        alert("Unable to fetch location");
        setLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("signupData", JSON.stringify(formData));
    navigate(`/verify-email?email=${formData.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />

          <input
            name="mobile"
            type="text"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit number"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />

          {/* ⭐ Address Input + Icon Button */}
          <div className="relative mb-4">
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            {/* ⭐ LOCATION ICON BUTTON */}
            <button
              type="button"
              onClick={fetchLocation}
              className="absolute right-3 top-3 text-blue-600"
            >
              📍
            </button>
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Fetching Location..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
