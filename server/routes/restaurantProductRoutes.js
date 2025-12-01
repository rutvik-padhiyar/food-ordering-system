// 📄 routes/restaurantProductRoutes.js

const express = require("express");
const router = express.Router();
const RestaurantProduct = require("../models/Product");
const Restaurant = require("../models/restaurantModel"); // ✅ NEW: restaurant info
const upload = require("../middleware/upload");

// ✅ POST: Add new product with image
router.post("/products", upload.single("image"), async(req, res) => {
    try {
        const { name, price, rating, address, category, deliveryTime, restaurantId } = req.body;
        const image = req.file ? req.file.filename : null;

        // Validation
        if (!name || !price || !rating || !address || !category || !deliveryTime || !restaurantId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const newProduct = new RestaurantProduct({
            name,
            price,
            rating,
            address,
            category,
            deliveryTime,
            restaurantId,
            image,
        });

        await newProduct.save();
        res.status(201).json({
            message: "✅ Product added successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("❌ Product upload error:", error);
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
});

// ✅ GET: All products
router.get("/products", async(req, res) => {
    try {
        const products = await RestaurantProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
});

// ✅ GET: Products by restaurant
router.get("/products/restaurant/:restaurantId", async(req, res) => {
    try {
        const { restaurantId } = req.params;
        const products = await RestaurantProduct.find({ restaurantId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch restaurant products", error: error.message });
    }
});

// ✅ PUT: Update product
router.put("/products/:id", upload.single("image"), async(req, res) => {
    try {
        const { name, price, rating, address, category, deliveryTime } = req.body;

        const updateData = {
            name,
            price,
            rating,
            address,
            category,
            deliveryTime,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updated = await RestaurantProduct.findByIdAndUpdate(
            req.params.id,
            updateData, { new: true }
        );

        res.json({ message: "✅ Product updated successfully", product: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
});

// ✅ DELETE: Product
router.delete("/products/:id", async(req, res) => {
    try {
        await RestaurantProduct.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
});

module.exports = router;