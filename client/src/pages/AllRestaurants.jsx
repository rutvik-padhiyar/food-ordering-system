// src/pages/AllRestaurants.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/restaurant/all")
      .then((res) => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching restaurants", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-lg p-8">Loading restaurants...</div>;

  return (
    <div>
      {/* ✅ Banner Image with 3D Gradient Text Overlay */}
      <div className="relative w-full h-[400px] overflow-hidden rounded-xl mb-6 shadow-2xl">
        <img
          src="/images/res.jpg"
          alt="Restaurant Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-4xl md:text-9xl font-extrabold text-transparent bg-clip-text 
            bg-gradient-to-r from-orange-400 via-pink-500 to-red-500
            drop-shadow-[0_5px_15px_rgba(255,255,255,0.7)] shadow-blue-500">
            All RESTAURANTS
          </h2>
        </div>
      </div>

      {/* ✅ Infinite Scrolling Text Line */}
      <div className="py-6 rounded-md mb-6 marquee-wrapper" style={{ backgroundColor: '#c9f31d' }}>
        <div className="marquee-content text-blue-900 font-semibold text-base">
          🏪 Swad Restaurant | 🍽️ Tandoori Treats Available | 📍 Ahmedabad | ⭐ Rated 4.8 | 🚀 Fast Delivery Across India | 🍕 Pizza Point now open | 🍛 Punjabi Flavours at your doorstep | 🛵 Free delivery over ₹200! | 🌍 Serving All Over India | ✅ 100% Verified Restaurants | 🎯 Easy Ordering & Tracking | 📱 Mobile Friendly Experience | 🧾 Digital Payments Accepted | 🎉 Weekend Offers Available | 🧑‍🍳 Top Chefs From Across India | 💼 Corporate Orders Accepted | 🍴 Pure Veg & Non-Veg Options | 📦 Contactless Delivery |

          🏪 Swad Restaurant | 🍽️ Tandoori Treats Available | 📍 Ahmedabad | ⭐ Rated 4.8 | 🚀 Fast Delivery Across India | 🍕 Pizza Point now open | 🍛 Punjabi Flavours at your doorstep | 🛵 Free delivery over ₹200! | 🌍 Serving All Over India | ✅ 100% Verified Restaurants | 🎯 Easy Ordering & Tracking | 📱 Mobile Friendly Experience | 🧾 Digital Payments Accepted | 🎉 Weekend Offers Available | 🧑‍🍳 Top Chefs From Across India | 💼 Corporate Orders Accepted | 🍴 Pure Veg & Non-Veg Options | 📦 Contactless Delivery |
        </div>
      </div>

      {/* ✅ Restaurant Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((rest, index) => (
          <div
            key={rest._id}
            className={`rounded-2xl shadow-xl p-4 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] 
              bg-gradient-to-br from-white to-gray-100 border-2 border-transparent hover:border-indigo-400`}
            style={{
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
            }}
          >
            <img
              src={`http://localhost:5000/uploads/${rest.restaurantImage}`}
              alt="restaurant"
              className="w-full h-40 object-cover rounded-xl mb-3 border border-gray-200 shadow-sm"
            />
            <h3 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text mb-1">
              {rest.name}
            </h3>
            <p className="text-sm text-gray-700">
              👤 <span className="font-semibold">{rest.ownerName}</span>
            </p>
            <p className="text-sm text-gray-700">
              📞 <span className="text-blue-600">{rest.mobile}</span>
            </p>
            <p className="text-sm text-gray-700">
              📧 <span className="text-green-700">{rest.email}</span>
            </p>
            <p className="text-sm text-gray-700">
              📍 <span className="text-rose-600">{rest.address}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRestaurants;
