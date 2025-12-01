import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const load = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs?limit=100");
      setBlogs(res.data.blogs || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button
          onClick={() => navigate("/admin/blogs/new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Blog
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Author</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">
                  <Link
                    to={`/blogs/${b.slug}`}
                    className="text-indigo-600"
                    target="_blank"
                  >
                    {b.title}
                  </Link>
                </td>
                <td className="p-3">{b.category}</td>
                <td className="p-3">{b.author || "Admin"}</td>
                <td className="p-3">
                  {new Date(b.publishedAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/blogs/${b._id}/edit`)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(b._id)}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={5}>
                  No blogs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
