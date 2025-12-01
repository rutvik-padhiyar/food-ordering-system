const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Unique filename
    },
});

const upload = multer({ storage });

// Get user profile
router.get("/profile", authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Full image URL banake bhejna
        const userWithFullImage = {
            ...user.toObject(),
            profileImage: user.profileImage ?
                `${req.protocol}://${req.get("host")}${user.profileImage}` : null,
        };

        res.json(userWithFullImage);
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({ message: "Server error." });
    }
});


// Update user profile
router.put(
    "/profile",
    authMiddleware,
    upload.single("image"),
    async(req, res) => {
        try {
            const { name, email, mobile, address } = req.body; // ✅ Address destructure

            const updateFields = {};
            if (name) updateFields.name = name;
            if (email) updateFields.email = email;
            if (mobile) updateFields.mobile = mobile;
            if (address) updateFields.address = address; // ✅ Save address

            if (req.file) {
                // ✅ Save profile image path
                updateFields.profileImage = `/uploads/${req.file.filename}`;
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                updateFields, { new: true, runValidators: true }
            ).select("-password");

            // ✅ Return full image URL
            const userWithFullImage = {
                ...updatedUser.toObject(),
                profileImage: updatedUser.profileImage ?
                    `${req.protocol}://${req.get("host")}${updatedUser.profileImage}` : null,
            };

            res.json({
                message: "Profile updated successfully.",
                user: userWithFullImage,
            });
        } catch (error) {
            console.error("Error updating profile:", error.message);
            res.status(500).json({ message: "Failed to update profile." });
        }
    }
);
router.get("/support-info", (req, res) => {
    res.json({
        phone: process.env.SUPPORT_PHONE,
        appName: process.env.APP_NAME
    });
});


module.exports = router;