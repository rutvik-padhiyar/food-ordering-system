const mongoose = require("mongoose");

// tiny slugify (no extra package)
function makeSlug(str) {
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    image: { type: String, default: "" }, // full URL or /uploads/...
    author: { type: String, default: "Admin" },
    excerpt: { type: String, default: "" }, // short summary for list page
    content: { type: String, required: true }, // full HTML/markdown allowed
    category: {
        type: String,
        enum: [
            "General", // ✅ added here
            "Restaurants",
            "Product",
            "Tips",
            "Stories",
            "News",
            "Other",
        ],
        default: "General", // ✅ default bhi General kar diya
    },
    readTime: { type: Number, default: 3 }, // minutes
    status: {
        type: String,
        enum: ["published", "draft"],
        default: "published",
    },
    publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

blogSchema.pre("save", function(next) {
    if (!this.slug) this.slug = makeSlug(this.title);
    // naive read time = ~200 wpm
    if (!this.readTime && this.content) {
        const words = String(this.content).split(/\s+/).length;
        this.readTime = Math.max(1, Math.ceil(words / 200));
    }
    next();
});

module.exports = mongoose.model("Blog", blogSchema);