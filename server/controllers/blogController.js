const Blog = require("../models/blogModel");

// GET /api/blogs?search=&category=&page=1&limit=9
exports.listBlogs = async(req, res) => {
    try {
        const { search = "", category = "", page = 1, limit = 9 } = req.query;

        const filter = { status: "published" };
        if (search) filter.title = { $regex: search, $options: "i" };
        if (category) filter.category = category;

        const skip = (Number(page) - 1) * Number(limit);

        const [blogs, total] = await Promise.all([
            Blog.find(filter)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select(
                "title slug image author excerpt category readTime publishedAt"
            ),
            Blog.countDocuments(filter),
        ]);

        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit) || 1),
            blogs,
        });
    } catch (err) {
        console.error("listBlogs error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch blogs" });
    }
};

// GET /api/blogs/:slug
exports.getBlogBySlug = async(req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            status: "published",
        });
        if (!blog)
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        res.json({ success: true, blog });
    } catch (err) {
        console.error("getBlogBySlug error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch blog" });
    }
};

// ADMIN: POST /api/blogs
exports.createBlog = async(req, res) => {
    try {
        const { title, author, excerpt, content, category, status } = req.body;

        if (!title || !content) {
            return res
                .status(400)
                .json({ success: false, message: "Title & content required" });
        }

        // ✅ Agar file upload hai (local uploads se)
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // ✅ Local file path
        }

        const blog = await Blog.create({
            title,
            image: imageUrl,
            author,
            excerpt,
            content,
            category,
            status: status || "published",
        });

        res.status(201).json({ success: true, blog });
    } catch (err) {
        console.error("createBlog error:", err);
        res.status(500).json({ success: false, message: "Failed to create blog" });
    }
};

// ADMIN: PUT /api/blogs/:id
exports.updateBlog = async(req, res) => {
    try {
        const { title, excerpt, content, category, status, author } = req.body;

        const updateData = {
            title,
            excerpt,
            content,
            category,
            status,
            author,
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`; // ✅ local path
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!blog)
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });

        res.json({ success: true, blog });
    } catch (err) {
        console.error("updateBlog error:", err);
        res.status(500).json({ success: false, message: "Failed to update blog" });
    }
};

// ADMIN: DELETE /api/blogs/:id
exports.deleteBlog = async(req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog)
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        res.json({ success: true, message: "Blog deleted" });
    } catch (err) {
        console.error("deleteBlog error:", err);
        res.status(500).json({ success: false, message: "Failed to delete blog" });
    }
};