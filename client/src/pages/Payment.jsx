import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const addressId = state?.addressId || "no_address";

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => console.log("Razorpay Loaded");
    document.body.appendChild(script);
  };

  const payNow = async () => {
    try {
      const amount = 500; // Cart total

      // 1️⃣ CREATE ORDER FROM BACKEND
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount }
      );

      const order = res.data.order;
      const key = res.data.key;

      // 2️⃣ RAZORPAY WINDOW
      const options = {
        key: key, // Your Key ID
        amount: order.amount,
        currency: "INR",
        name: "Food App",
        description: "Food Order Payment",
        order_id: order.id,

        handler: async function (response) {
          // 3️⃣ VERIFY PAYMENT
          const verify = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response
          );

          if (verify.data.success) {
            navigate("/thankyou", {
              state: {
                paymentId: verify.data.paymentId,
                orderId: verify.data.orderId,
                addressId,
                amount,
              },
            });
          } else {
            alert("Payment Failed!");
          }
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Page</h1>
      <button
        onClick={payNow}
        style={{
          padding: "12px 30px",
          background: "blue",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
          fontSize: 18,
        }}
      >
        Pay Now
      </button>
    </div>
  );
}
