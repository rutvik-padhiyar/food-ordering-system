// AllFoods.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/admin/foods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFoods(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch foods. Make sure you are logged in.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/admin/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setFoods((prev) => prev.filter((f) => f._id !== id)))
      .catch((err) => console.error(err));
  };

  if (loading) return <p className="text-white text-xl">Loading foods...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 animate-gradient-x p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-400 animate-text-gradient">
        🍔 All Foods
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/10 backdrop-blur-xl rounded-xl shadow-xl text-white">
          <thead className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Restaurant</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food, index) => (
              <tr
                key={food._id}
                className={`transition-transform transform hover:scale-102 ${
                  index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                }`}
              >
                <td className="px-6 py-3">{food.name}</td>
                <td className="px-6 py-3">₹{food.price}</td>
                <td className="px-6 py-3">{food.category}</td>
                <td className="px-6 py-3">{food.restaurant?.name || "N/A"}</td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-md transition duration-300 transform hover:scale-110"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/admin/edit-food/${food._id}`}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md transition duration-300 transform hover:scale-110"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tailwind custom animations */}
      <style>
        {`
          @keyframes gradient-x {
            0% {background-position:0% 50%}
            50% {background-position:100% 50%}
            100% {background-position:0% 50%}
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 20s ease infinite;
          }
          @keyframes text-gradient {
            0%,100% {background-position:0% 50%}
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
