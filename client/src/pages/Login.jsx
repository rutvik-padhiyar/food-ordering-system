// 📁 Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Auto-fill from signup
  useEffect(() => {
    const email = localStorage.getItem("autoLoginEmail");
    const password = localStorage.getItem("autoLoginPassword");

    if (email && password) {
      setFormData({ email, password });
      localStorage.removeItem("autoLoginEmail");
      localStorage.removeItem("autoLoginPassword");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // ✅ Store JWT token
      localStorage.setItem("token", res.data.token);

      // ✅ Fire loginSuccess event to auto-refresh Navbar
      window.dispatchEvent(new Event("loginSuccess"));

      // ✅ Show success message
      setSuccessMessage("Login Successful ✅");

      // ✅ Role-based redirect
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/orders"); // Admin login → dashboard
        } else {
          navigate("/"); // Normal user → home page
        }
      }, 1000); // 1 second delay for success message

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Login to Account</h2>

        {/* ✅ Show login success message */}
        {successMessage && (
          <div className="text-green-600 text-center font-semibold mb-4">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* ✅ Forgot Password link */}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-500 hover:underline hover:text-indigo-700 transition"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
