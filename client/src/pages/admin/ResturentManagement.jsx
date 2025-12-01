// AdminRestaurants.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRestaurants = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch restaurants. Make sure you are logged in.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(restaurants.filter((r) => r._id !== id));
      alert("✅ Restaurant deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete restaurant.");
    }
  };

  const handleBlock = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/admin/restaurants/block/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedRestaurant = res.data.restaurant;
      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isBlocked: updatedRestaurant.isBlocked } : r
        )
      );

      alert(res.data.message); // ✅ Show "Restaurant blocked" or "unblocked"
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to block/unblock restaurant.");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading restaurants...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 animate-gradient-x text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏪 All Restaurants</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          <thead>
            <tr className="bg-white/20 text-white">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r._id} className="hover:bg-white/10 transition-colors">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.ownerName}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">
                  {r.isBlocked ? (
                    <span className="bg-red-600 px-2 py-1 rounded-full text-xs">Blocked</span>
                  ) : (
                    <span className="bg-green-600 px-2 py-1 rounded-full text-xs">Active</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    to={`/admin/edit-restaurant/${r._id}`}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleBlock(r._id)}
                    className={`px-3 py-1 rounded ${
                      r.isBlocked
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-purple-500 hover:bg-purple-600"
                    } transition-colors`}
                  >
                    {r.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tailwind animation for background */}
      <style>
        {`
          @keyframes gradient-x {
            0%,100% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 10s ease infinite;
          }
        `}
      </style>
    </div>
  );
}

