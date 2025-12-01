// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data.cart);
      } catch (error) {
        console.error("❌ Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart({ items: guestCart });
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    if (token) {
      try {
        const updatedItems = cart.items.map((item) => {
          if (item.product._id === productId) {
            const newQty = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQty };
          }
          return item;
        });
        setCart({ ...cart, items: updatedItems });

        await axios.put(
          `http://localhost:5000/api/cart/update`,
          {
            productId,
            quantity: updatedItems.find((i) => i.product._id === productId).quantity,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("❌ Failed to update quantity:", error);
      }
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.error("❌ Failed to remove item:", error.response?.data || error.message);
    }
  };

  const placeOrder = async () => {
    if (!token) {
      alert("Please login to place your order.");
      window.location.href = "/login";
      return;
    }

    try {
      setPlacingOrder(true);

      const orderItems = cart.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        "http://localhost:5000/api/order/place",
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = response.data.order;

      toast.success("Order placed successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      // ✅ Redirect to ThankYouPage with orderId
      setTimeout(() => {
        navigate(`/thank-you/${order._id}`);
      }, 2000);

      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart();
    } catch (error) {
      console.error("❌ Failed to place order:", error);
      toast.error("Failed to place order. Please try again.", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  const getTotalPrice = () => {
    return cart?.items?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium text-gray-700">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <ToastContainer />

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Cart
      </h2>

      {cart?.items?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cart.items.map((item) => (
              <div
                key={item._id || item.product._id}
                className="flex bg-white shadow-md rounded-xl p-4 gap-4 border border-gray-200 relative"
              >
                <img
                  src={`http://localhost:5000/uploads/${item.product.image}`}
                  alt={item.product.name}
                  className="w-32 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600">
                    Price: ₹{item.product.price} x {item.quantity} ={" "}
                    <strong>₹{item.product.price * item.quantity}</strong>
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, -1)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-lg rounded"
                    >
                      −
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, 1)}
                      className="px-2 py-1 bg-green-200 text-green-700 text-lg rounded"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-gray-600 mt-2">Restaurant: {item.product.address}</p>
                  <p className="text-gray-600">⭐ {item.product.rating}</p>
                  <p className="text-gray-600">Delivery: {item.product.deliveryTime} min</p>
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg"
                  title="Remove item"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right text-xl font-bold text-gray-800">
            Total: ₹{getTotalPrice()}
          </div>

          <div className="mt-6 text-center">
           <button
  onClick={() => navigate("/checkout")}
  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-200"
>
  Proceed to Checkout
</button>

          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
