import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import HomeFeedbackSection from "../components/HomeFeedbackSection";

const ThankYouPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  // ✅ Thank You page open hote hi 2s baad feedback popup
  useEffect(() => {
    const t = setTimeout(() => setShowFeedbackPopup(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading your order...
      </div>
    );
  }

  const estimatedMins = 30 + Math.floor(Math.random() * 15); // simple estimate

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">🎉 Thank you for your order!</h1>
        <p className="text-gray-600 mt-2">We’re preparing your food.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Order Info</h2>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Order ID:</span>{" "}
            <span className="font-mono">{order._id}</span>
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Placed:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Restaurant:</span>{" "}
            {order.restaurant?.name || "—"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">ETA:</span> {estimatedMins} mins
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Delivery & Payment</h2>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Address:</span> {order.address}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Payment:</span> {order.paymentMethod}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">{order.status}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-b py-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {order.foodItems?.map((item, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-b-0">
            <span className="text-gray-800">
              {item.name} × {item.quantity}
            </span>
            <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 text-lg font-bold">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          Continue Shopping
        </Link>
        <Link
          to="/my-orders"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          View My Orders
        </Link>
        <button
          onClick={() => setShowFeedbackPopup(true)}
          className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-lg font-medium"
        >
          Give Feedback
        </button>
      </div>

      {/* ✅ Feedback Popup yahin (Thank You ke baad) */}
      {showFeedbackPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-xl p-6 rounded-xl relative shadow-lg">
            <button
              onClick={() => setShowFeedbackPopup(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl font-bold"
              aria-label="Close"
            >
              ✕
            </button>

            {!feedbackSubmitted ? (
              <HomeFeedbackSection onSubmitSuccess={() => setFeedbackSubmitted(true)} />
            ) : (
              <div className="text-center py-6">
                <h2 className="text-2xl font-semibold mb-4">Thank you for your feedback! 🎉</h2>
                <button
                  onClick={() => setShowFeedbackPopup(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThankYouPage;
