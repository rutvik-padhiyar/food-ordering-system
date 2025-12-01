import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("❌ Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center mt-10 text-gray-500">You have no orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">📦 My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="mb-6 border p-4 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-semibold mb-2">Order #{order._id}</h3>
          <p className="text-gray-500 mb-1">Status: <strong className="capitalize">{order.status}</strong></p>
          <p className="text-gray-500 mb-3">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>

          {order.items?.map((item) => {
            const product = item.food || item.product;

            const imageUrl = product?.image
              ? `http://localhost:5000/uploads/${product.image}`
              : "/no-image.png";

            return (
              <div key={item._id} className="flex items-center border-t py-3 gap-4">
                <img
                  src={imageUrl}
                  alt={product?.name || "Food Item"}
                  className="w-20 h-16 object-cover rounded-lg border"
                />

                <div className="flex justify-between w-full">
                  <div>
                    <p className="font-medium text-gray-800">{product?.name || "Unknown Item"}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-700">
                    ₹{(product?.price || 0) * item.quantity}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="text-right mt-4 font-bold text-green-700">
            Total: ₹{order.totalPrice || 0}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
