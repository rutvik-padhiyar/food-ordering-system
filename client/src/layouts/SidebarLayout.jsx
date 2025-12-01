// src/components/SidebarLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/admin/orders" },
  { name: "Add Restaurant", path: "/add-restaurant" },
  { name: "Add Food", path: "/add-food" },
  { name: "All Foods", path: "/admin/foods" },
  { name: "All Users", path: "/admin/users" },
  { name: "Restaurant Management", path: "/admin/restaurants" }, // ✅ updated
  { name: "Feedback Management", path: "/admin/feedbacks" },
];

export default function SidebarLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-indigo-700 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">🍽 Admin Panel</h2>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 rounded hover:bg-indigo-600 transition ${
              location.pathname === link.path ? "bg-indigo-600" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
}
