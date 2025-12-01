// 📄 src/pages/HelpCenter.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LOGO_URL = "/images/fav.png";
 // public folder me rakho

export default function HelpCenter() {
  const [supportInfo, setSupportInfo] = useState({ phone: "", appName: "" });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend se support phone & app name la rahe hain
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/support-info")
      .then((res) => {
        setSupportInfo(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch support info:", err);
      });
  }, []);

  // User profile fetch (optional: taaki name/email message me aaye)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.warn("Profile fetch failed:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); 

  // Message text bana rahe hain
  const buildMessage = () => {
    const parts = [`Hi, I need help with ${supportInfo.appName}.`];
    if (profile?.name) parts.push(`My name is ${profile.name}.`);
    if (profile?.email) parts.push(`Email: ${profile.email}.`);
    return encodeURIComponent(parts.join(" "));
  };

  // WhatsApp link
  const whatsappUrl = `https://wa.me/${supportInfo.phone}?text=${buildMessage()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col items-center">
          {/* Logo circle */}
          <div className="w-36 h-36 rounded-full p-[4px] bg-gradient-to-tr from-green-400 via-teal-500 to-indigo-600">
            <div className="bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden relative">
              <img
                src={LOGO_URL}
                alt={`${supportInfo.appName} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
              {!LOGO_URL && (
                <div className="absolute w-36 h-36 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {supportInfo.appName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-800">
            {supportInfo.appName || "Loading..."}
          </h1>

          <p className="mt-2 text-sm text-gray-500 text-center">
            Need help? Chat with our support on WhatsApp.
          </p>

          {supportInfo.phone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block w-56 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-full shadow-md transition"
            >
              Continue to Chat
            </a>
          ) : (
            <p className="mt-6 text-gray-400">Loading support details...</p>
          )}

          <p className="mt-6 text-xs text-gray-400 text-center">
            Don&apos;t have WhatsApp yet?{" "}
            <a
              href="https://www.whatsapp.com/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download
            </a>
          </p>

          {!loading && profile && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              We will include your name <strong>{profile.name}</strong> and email{" "}
              <strong>{profile.email}</strong> in the message to speed things up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
