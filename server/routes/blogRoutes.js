const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");
const {
    listBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

// 🔹 Multer setup for local uploads
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/"); // ✅ images uploads folder me jayengi
    },
    filename: function(req, file, cb) {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

// -------------------- Public Routes --------------------
router.get("/", listBlogs);
router.get("/:slug", getBlogBySlug);

// -------------------- Admin/Partner only --------------------
router.post(
    "/",
    auth,
    roleCheck(["admin", "partner", "masteradmin"]),
    upload.single("image"), // ✅ local file handle
    createBlog
);

router.put(
    "/:id",
    auth,
    roleCheck(["admin", "partner", "masteradmin"]),
    upload.single("image"), // ✅ local file handle
    updateBlog
);

router.delete(
    "/:id",
    auth,
    roleCheck(["admin", "partner", "masteradmin"]),
    deleteBlog
);

module.exports = router;