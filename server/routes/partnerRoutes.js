const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");

const RestaurantProduct = require("../models/Product");
const Order = require("../models/orderModel");

router.get("/stats", auth, roleCheck(["partner", "admin", "masteradmin"]), async(req, res) => {
    try {
        const products = await RestaurantProduct.find({ owner: req.user._id });
        const productIds = products.map(p => p._id);

        const orders = await Order.find({ "items.product": { $in: productIds } });

        const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: revenue
        });
    } catch (error) {
        res.status(500).json({ message: "Partner dashboard error", error: error.message });
    }
});

module.exports = router;