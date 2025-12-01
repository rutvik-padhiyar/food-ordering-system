import React, { useEffect, useState } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";

const BASE_URL = ""; // 🔹 Set backend base URL if needed

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    age: "",
    image: null,
  });

  // Fetch Profile
  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        address: data.address || "",
        age: data.age || "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("address", formData.address);
    data.append("age", formData.age);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put("/api/user/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
      setEditMode(false);
      getUserProfile();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Profile Image & Basic Info */}
        <div className="lg:w-1/3 bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-8 flex flex-col items-center justify-center text-white relative">
          <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-600 shadow-lg">
            <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
              {profile.profileImage ? (
                <img
                  src={
                    profile.profileImage.startsWith("http")
                      ? profile.profileImage
                      : `${BASE_URL}${profile.profileImage}`
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-400 to-indigo-600 flex items-center justify-center text-white text-6xl font-extrabold uppercase select-none">
                  {profile?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-wide drop-shadow-md text-center">
            {profile?.name}
          </h1>
          <p className="mt-1 text-sm font-semibold tracking-wide text-indigo-200 text-center break-all">
            {profile?.email}
          </p>

          <button
            onClick={() => setEditMode(true)}
            className="mt-10 bg-white text-purple-700 font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 w-full max-w-xs mx-auto"
            aria-label="Edit Profile"
          >
            Edit Profile
          </button>
        </div>

        {/* Right Panel: Profile Details or Edit Form */}
        <div className="lg:w-2/3 p-8 sm:p-10">
          {!editMode ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 border-b border-purple-200 pb-2 mb-6">
                Profile Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 text-gray-700 text-lg">
                <div>
                  <p className="font-semibold text-gray-900">Mobile</p>
                  <p className="mt-1 break-words">{profile?.mobile || "N/A"}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="mt-1 break-words">{profile?.address || "N/A"}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Age</p>
                  <p className="mt-1">{profile?.age || "N/A"}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Status</p>
                  <p className="mt-1">
                    {profile?.isActive ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactive</span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">OTP Verified</p>
                  <p className="mt-1">
                    {profile?.otpVerified ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleUpdate}
              className="max-w-xl mx-auto space-y-6"
              autoComplete="off"
            >
              <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
                Update Profile
              </h2>

              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="mobile"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Profile Image
                </label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 w-28 h-28 rounded-full object-cover border-4 border-purple-600 shadow-lg"
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-purple-800 transition transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
