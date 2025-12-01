import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantPage = () => {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);

  // ✅ Fetch all foods for this restaurant
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/food/restaurant/${id}/foods`
        );
        setFoods(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch foods:", error);
        toast.error("Could not load foods");
      }
    };

    fetchFoods();
  }, [id]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning(
        "Please login or signup first after to add items to cart and place order.",
        {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: true,
          closeOnClick: true,
          theme: "colored",
        }
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Added to cart:", response.data);

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("✅ Product added to cart successfully!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } catch (error) {
      console.error(
        "❌ Failed to add to cart:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to add to cart. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px", fontWeight: "600" }}>
        Explore Menu
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {foods.map((food) => (
          <div
            key={food._id}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                alt={food.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                  color: "white",
                  padding: "8px 12px",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                ITEMS AT ₹{food.price}
              </div>
            </div>

            <div style={{ padding: "12px 16px" }}>
              <h4
                style={{
                  fontSize: "18px",
                  marginBottom: "6px",
                  fontWeight: "600",
                }}
              >
                {food.name}
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: "#2ecc71",
                  fontWeight: "500",
                }}
              >
                ⭐ {food.rating} • {food.deliveryTime} mins
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "2px",
                }}
              >
                {food.category}
              </p>
              <p style={{ fontSize: "13px", color: "#999" }}>{food.address}</p>

              <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleAddToCart(food._id)}
                  style={{
                    backgroundColor: "#ff6600",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast container yahan add karna zaruri hai */}
      <ToastContainer />
    </div>
  );
};

export default RestaurantPage;
