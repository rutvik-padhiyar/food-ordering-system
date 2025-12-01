// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaUser,
  FaSearch,
} from "react-icons/fa";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);
  const [address, setAddress] = useState("");
  const [searchInput, setSearchInput] = useState(""); // ✅ manual location search

  useEffect(() => {
    fetchLocation();

    // ✅ Listen for "resetHome" event from Navbar
    const handleReset = () => {
      setSearchInput("");
      setAddress("");
      fetchLocation(); // re-detect location + restaurants
    };
    window.addEventListener("resetHome", handleReset);

    return () => {
      window.removeEventListener("resetHome", handleReset);
    };
  }, []);

  // ✅ Always fetch Deesa location
  const fetchLocation = async () => {
    try {
      const deesaLat = 24.2586;
      const deesaLng = 72.1907;

      setLocation({ lat: deesaLat, lng: deesaLng });
      setAddress("Deesa");

      fetchRestaurants(deesaLat, deesaLng);
    } catch (err) {
      console.error("❌ Failed to set fixed Deesa location:", err);
      fetchRestaurants();
    }
  };

  // ✅ Manual search (force Deesa always)
  const handleSearch = async () => {
    try {
      const deesaLat = 24.2586;
      const deesaLng = 72.1907;

      setLocation({ lat: deesaLat, lng: deesaLng });
      setAddress("Deesa");

      fetchRestaurants(deesaLat, deesaLng);
    } catch (err) {
      console.error("❌ Search failed:", err);
    }
  };

  // ✅ Fetch restaurants
  const fetchRestaurants = async (lat, lng) => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/restaurant/all";
      if (lat && lng) {
        url = `http://localhost:5000/api/restaurant/nearby?lat=${lat}&lng=${lng}&distance=5`;
      }
      const res = await axios.get(url);
      setRestaurants(res.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#021f15] via-[#043927] to-[#065f46] min-h-screen p-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg tracking-wide">
        🍽️ Discover Restaurants{" "}
        <span className="text-[#00ffae]">{address ? `in ${address}` : ""}</span>
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20">
          <input
            type="text"
            placeholder="🔍 Enter city, area, or address..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-80 px-4 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-green-500 transition-all duration-300 flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* Restaurant List */}
      {loading ? (
        <p className="text-gray-200 text-center text-lg animate-pulse">
          ⏳ Fetching delicious restaurants in Deesa...
        </p>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-300 text-center text-lg">
          😔 No restaurants available in Deesa. Please try again later.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="group relative bg-white/90 rounded-3xl shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transform hover:-translate-y-3 transition-all duration-500 overflow-hidden border border-white/30 backdrop-blur-lg"
            >
              {/* Restaurant Image */}
              <div className="overflow-hidden h-52">
                <img
                  src={`http://localhost:5000/uploads/${restaurant.restaurantImage}`}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                  onError={(e) => {
                    e.target.src = "/images/no-image.jpg";
                  }}
                />
              </div>

              {/* Restaurant Details */}
              <div className="p-5 space-y-3">
                <h2 className="text-2xl font-bold text-[#043927] group-hover:text-emerald-600 transition">
                  {restaurant.name}
                </h2>

                <p className="flex items-center text-sm text-gray-600">
                  <FaUser className="mr-2 text-[#00A862]" />
                  {restaurant.ownerName}
                </p>

                <p className="flex items-center text-sm text-gray-600">
                  <FaPhone className="mr-2 text-[#00A862]" />
                  {restaurant.mobile}
                </p>

                <p className="flex items-center text-sm text-gray-600">
                  <FaEnvelope className="mr-2 text-[#00A862]" />
                  {restaurant.email}
                </p>

                {restaurant.distanceInKm && (
                  <p className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#00A862]" />
                    {restaurant.distanceInKm} km away
                  </p>
                )}

                {restaurant.rating && (
                  <p className="flex items-center text-sm text-yellow-500 font-semibold">
                    <FaStar className="mr-1" />
                    {restaurant.rating} / 5
                  </p>
                )}

                {/* Button */}
                <div className="pt-3">
                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="inline-block w-full text-center px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all duration-300"
                  >
                    🍕 View Foods
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
