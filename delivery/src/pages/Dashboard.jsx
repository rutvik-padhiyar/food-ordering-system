// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token & deliveryBoyId from localStorage after login
  const token = localStorage.getItem("deliveryToken");
  const deliveryBoyId = localStorage.getItem("deliveryBoyId");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/delivery/${deliveryBoyId}`, // backend API to get assigned orders
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(data.orders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Optional: Poll every 10 seconds for new orders
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders/update-status",
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh orders after status update
    } catch (err) {
      console.error(err);
    }
  };

  const acceptOrder = (orderId) => updateStatus(orderId, "accepted");
  const rejectOrder = (orderId) => updateStatus(orderId, "pending"); // optionally push back to queue
  const pickOrder = (orderId) => updateStatus(orderId, "picked");
  const outForDelivery = (orderId) => updateStatus(orderId, "out for delivery");
  const deliverOrder = (orderId) => updateStatus(orderId, "delivered");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold">Loading orders...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Delivery Dashboard
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders assigned.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded p-4 mb-4 shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                Order #{order._id.slice(-5)}
              </h2>
              <span className="text-sm text-gray-500">
                Status: {order.deliveryStatus}
              </span>
            </div>

            <p>
              <strong>User:</strong> {order.user?.name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Items:</strong>{" "}
              {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {order.deliveryStatus === "pending" && (
                <>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => acceptOrder(order._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => rejectOrder(order._id)}
                  >
                    Reject
                  </button>
                </>
              )}

              {order.deliveryStatus === "accepted" && (
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => pickOrder(order._id)}
                >
                  Picked
                </button>
              )}

              {order.deliveryStatus === "picked" && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => outForDelivery(order._id)}
                >
                  Out for Delivery
                </button>
              )}

              {order.deliveryStatus === "out for delivery" && (
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                  onClick={() => deliverOrder(order._id)}
                >
                  Delivered
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
