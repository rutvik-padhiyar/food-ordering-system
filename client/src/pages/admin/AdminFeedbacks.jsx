// src/pages/admin/AdminFeedback.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});

  const token = localStorage.getItem("token");

  // Fetch all feedbacks on mount
  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend might return array directly or inside data.feedbacks
      const feedbackData = response.data.feedbacks || response.data || [];
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle reply input change
  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Update feedback status and reply
  const handleUpdateFeedback = async (id) => {
    if (!replyInputs[id]) {
      alert("Please enter a reply before updating.");
      return;
    }

    try {
      setUpdatingId(id);
      await axios.put(
        `http://localhost:5000/api/feedback/${id}`,
        {
          status: "reviewed",
          reply: replyInputs[id],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Feedback updated successfully");
      fetchFeedbacks(); // Refresh after update
    } catch (error) {
      console.error("Failed to update feedback:", error);
      alert("Failed to update feedback");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading feedbacks...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Feedbacks</h1>
      {feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Rating</th>
              <th className="border border-gray-300 p-2">Comment</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Reply</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 break-all">
                  {fb.userId ? fb.userId._id || fb.userId : "Guest"}
                </td>
                <td className="border border-gray-300 p-2 text-center">{fb.rating}</td>
                <td className="border border-gray-300 p-2 max-w-xs break-words">{fb.comment}</td>
                <td className="border border-gray-300 p-2 text-center font-semibold">{fb.status}</td>
                <td className="border border-gray-300 p-2">
                  <textarea
                    rows="2"
                    className="w-full border rounded px-2 py-1"
                    value={replyInputs[fb._id] !== undefined ? replyInputs[fb._id] : fb.reply || ""}
                    onChange={(e) => handleReplyChange(fb._id, e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    disabled={updatingId === fb._id}
                    onClick={() => handleUpdateFeedback(fb._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {updatingId === fb._id ? "Updating..." : "Mark Reviewed & Reply"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminFeedback;
