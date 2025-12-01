import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* ✅ Brand Section (Left) */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-white mb-4">🍴 Zesto</h2>
          <p className="text-sm leading-relaxed">
            Order food & groceries online from the best restaurants near you.
          </p>
          {/* ✅ Delivery Partner Button */}
          <a
            href="http://localhost:3001/delivery-signup"   // ✅ Delivery app signup
            target="_blank"                                // ✅ Open in new tab
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
          >
            Become Delivery Partner
          </a>
        </div>

        {/* ✅ Company */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/blogs" className="hover:text-white">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* ✅ Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-white">Help & Support</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* ✅ Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><FaFacebookF /></a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><FaTwitter /></a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><FaInstagram /></a>
            <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
       Copyright ©  {new Date().getFullYear()} Zesto. All rights reserved.
      </div>
    </footer>
  );
}
