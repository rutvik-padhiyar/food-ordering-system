// src/pages/DeliverySignup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function DeliverySignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    vehicleType: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // ✅ Backend API call
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/delivery-auth/signup`,
        formData
      );

      alert("✅ Signup successful! Please login.");
      navigate("/delivery-login"); // ✅ Redirect to Delivery Login page
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg(err.response?.data?.message || "❌ Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full max-w-md shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          🛵 Delivery Partner Signup
        </h2>

        {errorMsg && (
          <p className="text-red-400 text-sm text-center mb-3">{errorMsg}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field w-full"
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="input-field w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="input-field w-full"
          />
          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type (Bike/Cycle/Scooter/Car)"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="input-field w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Current Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="input-field w-full"
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* ✅ Already have an account link */}
        <p className="text-center text-gray-300 mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/delivery-login"
            className="text-green-400 hover:text-green-300"
          >
            Login here
          </Link>
        </p>
      </div>

      <style>{`
        .input-field {
          background: rgba(255,255,255,0.1);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.2);
          outline: none;
          transition: 0.3s;
        }
        .input-field:focus {
          border-color: #00A862;
          background: rgba(255,255,255,0.2);
          box-shadow: 0 0 0 3px rgba(0,168,98,0.3);
        }
      `}</style>
    </div>
  );
}