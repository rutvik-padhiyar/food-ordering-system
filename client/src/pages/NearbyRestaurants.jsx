// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaUser,
  FaCrosshairs,
} from "react-icons/fa";

import NearbyRestaurants from "./NearbyRestaurants"; // ✅ Import added

const API_BASE = "http://localhost:5000";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  // user location + address
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);
  const [address, setAddress] = useState("");
  const [radiusKm, setRadiusKm] = useState(5); // default 5km

  // ✅ Device location fetch
  const fetchLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setAddress(data.display_name || "");
          } catch (err) {
            console.error("❌ Reverse geocoding failed:", err);
          }
        },
        (error) => {
          console.error("❌ Location error:", error);
          setLocationError("Location access denied or not available.");
        }
      );
    } else {
      setLocationError("Browser does not support geolocation.");
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // ✅ Nearby restaurants fetch
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      if (location.lat && location.lng) {
        const res = await axios.get(
          `${API_BASE}/api/restaurant/nearby?lat=${location.lat}&lng=${location.lng}&distance=${radiusKm}`
        );
        setRestaurants(res.data || []);
      } else {
        const res = await axios.get(`${API_BASE}/api/restaurant/all`);
        setRestaurants(res.data || []);
      }
    } catch (error) {
      console.error("❌ Failed to fetch restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [location.lat, location.lng, radiusKm]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const useMyLocation = () => {
    setLocationError(null);
    fetchLocation();
  };

  // ✅ Load selected restaurant foods
  const loadRestaurantFoods = async (restaurantId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/foods/${restaurantId}`);
      setFoods(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch foods:", err);
      setFoods([]);
    }
  };

  const handleViewRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    loadRestaurantFoods(restaurant._id);
  };

  const handleBack = () => {
    setSelectedRestaurant(null);
    setFoods([]);
  };

  return (
    <div className="bg-[#043927] min-h-screen p-6">
      {!selectedRestaurant ? (
        <>
          <h1 className="text-3xl font-bold mb-4 text-white text-center">
            🍽️ Nearby Restaurants
          </h1>

          {/* ✅ Manual location search */}
          <NearbyRestaurants />

          {/* ✅ Radius select + Use My Location */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_0.5fr] gap-3 items-end mb-4">
            <div></div> {/* Placeholder for removed LocationInput */}

            <div className="flex items-center gap-2">
              <select
                className="w-full rounded-lg p-2 bg-white text-gray-800"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
              >
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={8}>8 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
              </select>
              <button
                onClick={useMyLocation}
                className="flex items-center gap-2 px-3 py-2 bg-[#00A862] text-white rounded-lg hover:bg-[#008e53] transition"
              >
                <FaCrosshairs /> Use My Location
              </button>
            </div>
          </div>

          {/* ✅ Location info */}
          <div className="text-center my-4">
            {location.lat && location.lng ? (
              <>
                <p className="text-green-300 text-sm">
                  📍 Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </p>
                <p className="text-green-200 text-sm mt-1 truncate">
                  🗺️ Address: {address || "Loading address..."}
                </p>
              </>
            ) : locationError ? (
              <p className="text-red-300 text-sm">❌ {locationError}</p>
            ) : (
              <p className="text-gray-300 text-sm">📡 Detecting your location...</p>
            )}
          </div>

          {/* ✅ Restaurant list */}
          {loading ? (
            <p className="text-gray-300 text-center">⏳ Loading restaurants...</p>
          ) : restaurants.length === 0 ? (
            <p className="text-gray-300 text-center">
              😔 No restaurants nearby. Try expanding radius.
            </p>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transform hover:scale-105 transition duration-300 overflow-hidden border border-green-100"
                >
                  <img
                    src={`${API_BASE}/uploads/${restaurant.restaurantImage}`}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "/images/no-image.jpg";
                    }}
                  />

                  <div className="p-4 space-y-2">
                    <h2 className="text-xl font-bold text-[#043927]">{restaurant.name}</h2>

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

                    {restaurant.address && (
                      <p className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-[#00A862]" />
                        {restaurant.address}
                      </p>
                    )}

                    {typeof restaurant.rating === "number" && (
                      <p className="flex items-center text-sm text-yellow-500 font-medium">
                        <FaStar className="mr-1" />
                        {restaurant.rating} / 5
                      </p>
                    )}

                    {"distanceInKm" in restaurant && (
                      <p className="text-xs text-gray-500">~ {restaurant.distanceInKm} km away</p>
                    )}

                    <div className="pt-3">
                      <button
                        onClick={() => handleViewRestaurant(restaurant)}
                        className="inline-block px-4 py-2 bg-[#00A862] text-white text-sm font-semibold rounded-full hover:bg-[#008e53] transition"
                      >
                        🍕 View Foods
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // ✅ Restaurant detail
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ⬅ Back to Restaurants
          </button>

          <div className="flex gap-6">
            <img
              src={`${API_BASE}/uploads/${selectedRestaurant.restaurantImage}`}
              alt={selectedRestaurant.name}
              className="w-64 h-48 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#043927]">{selectedRestaurant.name}</h2>
              <p className="text-gray-600">{selectedRestaurant.address}</p>
              <p className="text-gray-600">⭐ {selectedRestaurant.rating}/5</p>
            </div>
          </div>

          <h3 className="mt-6 text-xl font-semibold text-[#043927]">🍔 Available Foods</h3>
          {foods.length === 0 ? (
            <p className="text-gray-500 mt-2">No foods available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                >
                  <img
                    src={`${API_BASE}/uploads/${food.image}`}
                    alt={food.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <h4 className="mt-2 font-semibold">{food.name}</h4>
                  <p className="text-gray-600">₹{food.price}</p>
                  <p className="text-xs text-gray-400">{food.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
