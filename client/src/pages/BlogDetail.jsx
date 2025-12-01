// src/pages/BlogDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

/**
 * Helper: simple HTML detection
 */
const isHTML = (str = "") => /<\/?[a-z][\s\S]*>/i.test(str);

/**
 * Helper: style images inside HTML content
 */
const styleInnerImages = (html = "") => {
  // add classes to existing <img> tags or create if missing
  html = html.replace(
    /<img([^>]*?)class="([^"]*?)"([^>]*)>/gi,
    (_m, before, cls, after) =>
      `<img${before}class="${cls} w-full h-[420px] object-cover rounded-2xl my-6"${after}>`
  );
  html = html.replace(
    /<img((?:(?!class=)[^>])*)>/gi,
    `<img class="w-full h-[420px] object-cover rounded-2xl my-6"$1>`
  );
  return html;
};

/**
 * Convert raw plain text (like the content you pasted) into structured HTML:
 * - intro box
 * - numbered step blocks
 * - lists for the "Best ideas" & "Benefits"
 * - conclusion box
 */
const formatBusinessContent = (raw = "") => {
  // If empty, return empty
  if (!raw) return "";

  // Normalize line endings
  let text = raw.replace(/\r\n/g, "\n").trim();

  // Try to find intro: text before "Step-by-Step" or before "Step" or before "1."
  let intro = "";
  let rest = text;

  const splitMarkers = ["Step-by-Step", "Step-by-Step", "Step-by-Step Guide", "Step-by-Step Guide to Start", "Step"];
  let splitIndex = -1;
  for (const m of splitMarkers) {
    const idx = text.indexOf(m);
    if (idx > -1 && (splitIndex === -1 || idx < splitIndex)) splitIndex = idx;
  }
  if (splitIndex > -1) {
    intro = text.slice(0, splitIndex).trim();
    rest = text.slice(splitIndex).trim();
  } else {
    // fallback: if there is a "1." marker
    const match1 = text.match(/\n\s*1[\.\)]\s/);
    if (match1) {
      const idx = text.indexOf(match1[0]);
      intro = text.slice(0, idx).trim();
      rest = text.slice(idx).trim();
    }
  }

  // Build HTML: intro box
  let html = "";
  if (intro) {
    html += `<div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6 text-gray-800 text-lg leading-7">${intro
      .replace(/\n+/g, "<br/><br/>")
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")}</div>`;
  }

  // Extract numbered steps from rest:
  // We'll look for patterns: "1." or "1)" or "1 " at line starts
  const stepRegex = /(?:^|\n)\s*(\d{1,2})[.)]\s*(.+?)(?=(\n\s*\d{1,2}[.)]\s)|$)/gs;
  const steps = [];
  let matched;
  while ((matched = stepRegex.exec(rest)) !== null) {
    const num = matched[1];
    const body = matched[2].trim();
    // inside body, check for sub-bullets using '-' or '•'
    const bullets = [];
    const lines = body.split("\n").map((l) => l.trim());
    const mainLines = [];
    lines.forEach((ln) => {
      if (/^[\-\•]\s+/.test(ln)) bullets.push(ln.replace(/^[\-\•]\s+/, ""));
      else mainLines.push(ln);
    });
    steps.push({ num, titleAndText: mainLines.join(" "), bullets });
  }

  // If steps found, render them
  if (steps.length) {
    html += `<div class="space-y-6">`;
    steps.forEach((s) => {
      // try to split title vs content: if there's a ':' or '-' near start
      let title = "";
      let body = "";
      const t = s.titleAndText;
      const idxSep = t.indexOf(":");
      if (idxSep > 0 && idxSep < 60) {
        title = t.slice(0, idxSep + 1);
        body = t.slice(idxSep + 1).trim();
      } else {
        // maybe first sentence is title-ish
        const firstSentence = t.split(".")[0];
        if (firstSentence.length < 80 && t.length > firstSentence.length + 5) {
          title = firstSentence;
          body = t.slice(firstSentence.length + 1).trim();
        } else {
          body = t;
        }
      }

      html += `
        <div class="flex gap-5">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">${s.num}</div>
          </div>
          <div class="flex-1">
            ${title ? `<h3 class="text-2xl font-bold text-gray-900 mb-2">${title}</h3>` : ""}
            ${body ? `<p class="text-[18px] text-gray-700 leading-7 mb-3">${body}</p>` : ""}
            ${
              s.bullets && s.bullets.length
                ? `<ul class="list-disc ml-6 space-y-2 text-gray-700 mb-3">${s.bullets
                    .map((b) => `<li>${b}</li>`)
                    .join("")}</ul>`
                : ""
            }
          </div>
        </div>
      `;
    });
    html += `</div>`;
  } else {
    // If no numbered steps found, attempt to split the rest into paragraphs by blank lines
    const paras = rest.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    html += `<div class="space-y-6">`;
    paras.forEach((p, i) => {
      // small highlight for the first paragraph
      if (i === 0) {
        html += `<p class="text-lg text-gray-700 leading-8">${p}</p>`;
      } else {
        html += `<p class="text-[18px] text-gray-700 leading-8">${p}</p>`;
      }
    });
    html += `</div>`;
  }

  // Extract special sections: Best Online Business Ideas, Benefits, Conclusion (if present in raw)
  // We'll search for those headings and render lists
  const ideasMatch = raw.match(/Best Online Business Ideas in 2025([\s\S]*)?(Benefits of Online Business|Conclusion|$)/i);
  if (ideasMatch && ideasMatch[1]) {
    const ideasText = ideasMatch[1].trim();
    const items = ideasText
      .split(/\n/)
      .map((l) => l.replace(/^[\-\•\d\.\) ]+/, "").trim())
      .filter(Boolean)
      .slice(0, 12);
    if (items.length) {
      html += `<div class="mt-6 p-6 bg-white border rounded-xl shadow-sm">
        <h4 class="text-xl font-semibold text-gray-900 mb-3">Best Online Business Ideas (2025)</h4>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">`;
      items.forEach((it) => {
        html += `<li class="flex items-start gap-3"><span class="mt-1 text-indigo-600 font-bold">•</span><span>${it}</span></li>`;
      });
      html += `</ul></div>`;
    }
  }

  const benefitsMatch = raw.match(/Benefits of Online Business([\s\S]*)?(Conclusion|$)/i);
  if (benefitsMatch && benefitsMatch[1]) {
    const benefitsText = benefitsMatch[1].trim();
    const items = benefitsText
      .split(/\n/)
      .map((l) => l.replace(/^[\-\•\d\.\) ]+/, "").trim())
      .filter(Boolean)
      .slice(0, 12);
    if (items.length) {
      html += `<div class="mt-6 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-xl">
        <h4 class="text-lg font-semibold text-amber-700 mb-2">Benefits</h4>
        <ul class="list-disc ml-6 text-gray-700 space-y-2">`;
      items.forEach((it) => {
        html += `<li>${it}</li>`;
      });
      html += `</ul></div>`;
    }
  }

  // Conclusion extraction
  const conclusionMatch = raw.match(/Conclusion([\s\S]*)$/i);
  if (conclusionMatch && conclusionMatch[1]) {
    const concl = conclusionMatch[1].trim();
    html += `<div class="mt-8 p-6 bg-indigo-50 border rounded-2xl">
      <h4 class="text-xl font-bold text-indigo-700 mb-2">Conclusion</h4>
      <p class="text-gray-800 leading-7">${concl}</p>
    </div>`;
  }

  return html;
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${slug}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      }
    };
    fetchBlog();
  }, [slug]);

  const formattedHTML = useMemo(() => {
    if (!blog?.content) return "";

    if (isHTML(blog.content)) {
      // style inner images and return as-is
      return styleInnerImages(blog.content);
    }

    // plain text -> convert to structured professional HTML
    return formatBusinessContent(blog.content);
  }, [blog?.content]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  const author = blog.author || "Admin";
  const date = new Date(blog.publishedAt).toLocaleDateString();

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <Link to="/blogs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
        ← Back to Blogs
      </Link>

      <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Banner */}
        {blog.image ? (
          <div className="relative">
            <img src={blog.image} alt={blog.title} className="w-full h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 flex gap-3">
              {blog.category && <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-medium">{blog.category}</span>}
              <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-medium">{blog.readTime} min read</span>
            </div>
          </div>
        ) : null}

        <div className="p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">{blog.title}</h1>

          <div className="mt-4 flex items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">{(author || "A").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}</div>
              <div>
                <div className="font-medium text-gray-800">{author}</div>
                <div className="text-gray-500">{date}</div>
              </div>
            </div>
            <div className="text-gray-500">🕒 {blog.readTime} min</div>
          </div>

          <hr className="my-6 border-gray-100" />

          {blog.excerpt && <div className="bg-gray-50 p-4 rounded-xl text-gray-700 mb-6">{blog.excerpt}</div>}

          <section className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formattedHTML }} />
          </section>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
