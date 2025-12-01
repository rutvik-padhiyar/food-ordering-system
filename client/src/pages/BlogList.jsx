// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("/api/blogs");
        setBlogs(data.blogs);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-8 md:grid-cols-2">
      {blogs.map((blog) => (
        <Link
          to={`/blogs/${blog.slug}`}
          key={blog._id}
          className="bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:rotate-1 hover:scale-105 hover:shadow-2xl"
        >
          <div className="overflow-hidden rounded-t-2xl">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-60 object-cover transform transition-transform duration-700 hover:scale-110"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span className="font-medium text-indigo-600">
                {blog.author}
              </span>
              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;
