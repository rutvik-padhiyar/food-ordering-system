// 📁 src/components/Navbar.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount, fetchCartCount } = useContext(CartContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "user");
      } catch (err) {
        console.error("❌ Invalid token:", err.message);
        setUserRole(null);
      }
    }

    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    const handleLoginSuccess = () => {
      fetchCartCount();
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role || "user");
        } catch {
          setUserRole(null);
        }
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/login");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleResetHome = () => {
    window.dispatchEvent(new Event("resetHome"));
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-indigo-600 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-white">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleResetHome}
          className="text-2xl font-bold hover:text-yellow-300 transition"
        >
          🍕Zesto
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={`hidden md:flex items-center space-x-4 ${
            userRole === "admin" ? "ml-auto" : ""
          }`}
        >
          {/* Home & All Restaurants - Always visible */}
          <Link to="/" onClick={handleResetHome} className="hover:text-yellow-300">
            Home
          </Link>
          <Link to="/restaurants" className="hover:text-yellow-300">
            All Restaurants
          </Link>

          {/* Admin Options */}
          {userRole === "admin" && (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-400 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-500 text-white"
              >
                🚪 Logout
              </button>
            </>
          )}

          {/* User Options */}
          {userRole === "user" && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-1 bg-green-500 rounded-full text-sm font-semibold hover:bg-green-600">
                My Account
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute hidden group-hover:flex flex-col right-0 mt-0 bg-white text-black rounded shadow-xl w-48 z-50 border border-gray-200">
                <Link
                  to="/my-orders"
                  className="px-4 py-2 flex items-center gap-2 hover:bg-green-100 text-gray-800 hover:text-green-600 rounded-md transition"
                >
                  📦 My Orders
                </Link>
                <Link to="/my-profile" className="px-4 py-2 hover:bg-gray-100 border-b">
                  👤 My Profile
                </Link>
                <Link to="/help-center" className="px-4 py-2 hover:bg-gray-100 border-b">
                  💬 Help Center
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}

          {/* Guest Options */}
          {!userRole && (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-yellow-300">
                Signup
              </Link>
            </>
          )}
        </nav>

        {/* Cart and Track Order - Only for user/guest */}
        {userRole !== "admin" && (
          <div className="flex items-center space-x-3">
            <Link
              to="/cart"
              className="bg-yellow-300 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-yellow-400"
            >
              🛒 Cart ({cartCount})
            </Link>
            <Link
              to="/track-order"
              className="bg-green-300 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-400"
            >
              📦 Track Order
            </Link>
          </div>
        )}

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden ml-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && userRole !== "admin" && (
        <div className="md:hidden bg-indigo-600 text-white px-6 py-4 border-t border-indigo-500">
          <Link
            to="/"
            onClick={() => {
              handleResetHome();
              setMenuOpen(false);
            }}
            className="block py-2 hover:text-yellow-300"
          >
            Home
          </Link>
          <Link to="/restaurants" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-yellow-300">
            All Restaurants
          </Link>

          {/* User Options */}
          {userRole === "user" && (
            <>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-yellow-300">
                📦 My Orders
              </Link>
              <Link to="/my-profile" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-yellow-300">
                👤 My Profile
              </Link>
              <Link to="/help-center" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-yellow-300">
                💬 Help Center
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2 hover:bg-red-500 rounded-md"
              >
                🚪 Logout
              </button>
            </>
          )}

          {/* Guest Options */}
          {!userRole && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-yellow-300">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-yellow-300">
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
