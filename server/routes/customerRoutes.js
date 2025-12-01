// 📁 server/routes/customerRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");

const Order = require("../models/orderModel");

// ✅ Account page route (simple welcome)
router.get("/account", auth, roleCheck("customer"), (req, res) => {
    res.json({ message: "Welcome to Customer Account Page 🔐" });
});

// ✅ Dashboard route showing orders
router.get("/my-dashboard", auth, roleCheck("customer"), async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});

module.exports = router;