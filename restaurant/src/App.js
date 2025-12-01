// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Auth pages
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantSignup from "./pages/RestaurantSignup";



function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Default route: Signup page */}
        <Route path="/" element={<RestaurantSignup />} />
        <Route path="/signup" element={<RestaurantSignup />} />
        <Route path="/login" element={<RestaurantLogin />} />

    
      </Routes>
    </Router>
  );
}

export default App;
