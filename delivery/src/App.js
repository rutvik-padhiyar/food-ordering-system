import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DeliveryLogin from "./pages/deliveryLogin";
import DeliverySignup from "./pages/deliverySignup";
import Dashboard from "./pages/Dashboard";   // Delivery dashboard
import Orders from "./pages/Orders";         // Delivery assigned orders

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/delivery-login" element={<DeliveryLogin />} />
        <Route path="/delivery-signup" element={<DeliverySignup />} />

       <Route path="/delivery-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/delivery-orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/delivery-login" />} />
      </Routes>
    </Router>
  );
}

// Protected route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/delivery-login" />;
  return children;
};

export default App;
