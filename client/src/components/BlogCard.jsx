import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <Link
      to={`/blogs/${blog.slug}`}
      className="group block hover:no-underline"
    >
      <div className="bg-white rounded-xl overflow-hidden transition hover:shadow-lg">
        {/* Blog Image */}
        <div className="relative">
          <img
            src={blog.image || "/no-image.png"}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Blog Content */}
        <div className="p-4">
          {/* Author + Date + ReadTime */}
          <div className="text-xs font-medium text-gray-500 mb-2">
            <span className="text-gray-700">{blog.author || "Admin"}</span>{" "}
            • {new Date(blog.publishedAt).toLocaleDateString()} •{" "}
            {blog.readTime} min read
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 line-clamp-2">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mt-2 text-base leading-relaxed line-clamp-3">
            {blog.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
