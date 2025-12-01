import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    author: "",
    excerpt: "",
    content: "",
    category: "General",
    status: "published",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("status", formData.status);

      if (formData.image) {
        data.append("image", formData.image); // ✅ file bhej rahe hai
      }

      await axios.post("/api/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/blogs"); // after success
    } catch (err) {
      console.error(err);
      alert("Failed to create blog");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full border p-2 rounded"
      />

      {/* ✅ Yaha image input hai */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData({ ...formData, image: e.target.files[0] })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Author"
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option>General</option>
        <option>Food</option>
        <option>Restaurant</option>
        <option>Lifestyle</option>
      </select>

      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full border p-2 rounded"
      >
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      <textarea
        placeholder="Short excerpt"
        value={formData.excerpt}
        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Full content (HTML allowed)"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full border p-2 rounded h-40"
      />

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/blogs")}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
