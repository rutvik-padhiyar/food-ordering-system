// AllUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users. Make sure you are logged in.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setUsers(users.filter((u) => u._id !== id)))
      .catch((err) => console.error(err));
  };

  if (loading) return <p className="text-white text-xl">Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative min-h-screen p-8 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Floating bubbles animation */}
      <div className="absolute w-6 h-6 bg-blue-400 rounded-full animate-bubble top-10 left-20 opacity-70"></div>
      <div className="absolute w-8 h-8 bg-pink-400 rounded-full animate-bubble top-40 left-80 opacity-60"></div>
      <div className="absolute w-5 h-5 bg-yellow-400 rounded-full animate-bubble top-64 left-60 opacity-50"></div>
      <div className="absolute w-7 h-7 bg-green-400 rounded-full animate-bubble top-20 left-96 opacity-70"></div>

      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 animate-text-gradient">
        👥 All Users
      </h1>

      <div className="overflow-x-auto relative z-10">
        <table className="min-w-full bg-white/10 backdrop-blur-xl rounded-xl shadow-xl text-white">
          <thead className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`transition-transform transform hover:scale-105 ${
                  index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                }`}
              >
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-md transition duration-300 transform hover:scale-110"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tailwind animations */}
      <style>
        {`
          @keyframes bubble {
            0% { transform: translateY(0) scale(1); opacity: 0.7; }
            50% { transform: translateY(-40px) scale(1.2); opacity: 0.9; }
            100% { transform: translateY(-80px) scale(1); opacity: 0.7; }
          }
          .animate-bubble {
            animation: bubble 6s ease-in-out infinite alternate;
          }

          @keyframes text-gradient {
            0%, 100% {background-position:0% 50%}
            50% {background-position:100% 50%}
          }
          .animate-text-gradient {
            background-size: 200% 200%;
            animation: text-gradient 5s ease infinite;
          }
        `}
      </style>
    </div>
  );
}
