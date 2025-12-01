const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const Food = require("../models/foodModel");

// Multer Config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only jpeg, jpg, png, and webp images are allowed"));
    }
};

const upload = multer({ storage, fileFilter });

// ✅ Add Food
router.post("/add", upload.single("image"), async(req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            address,
            rating,
            deliveryTime,
            restaurant, // this is restaurantId
            user,
        } = req.body;

        if (!restaurant) {
            return res.status(400).json({ message: "Restaurant ID is required" });
        }

        const newFood = new Food({
            name,
            description,
            price,
            image: req.file ? req.file.filename : "",
            category,
            address,
            rating,
            deliveryTime,
            restaurant, // correctly used here
            user,
        });

        await newFood.save();
        res.status(201).json({ message: "✅ Food added successfully", food: newFood });
    } catch (err) {
        console.error("❌ Error adding food:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// ✅ GET Food by Restaurant ID (Fixed ObjectId conversion)
router.get("/restaurant/:restaurantId/foods", async(req, res) => {
    try {
        const { restaurantId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID format" });
        }

        const foods = await Food.find({ restaurant: new mongoose.Types.ObjectId(restaurantId) });

        res.status(200).json(foods);
    } catch (err) {
        console.error("❌ Error fetching foods:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


// ✅ GET Food by Food ID
router.get("/:id", async(req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.status(200).json(food);
    } catch (err) {
        console.error("❌ Error fetching food by ID:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


module.exports = router;