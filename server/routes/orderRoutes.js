const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Restaurant = require("../models/restaurantModel");
const sendOrderEmail = require("../utils/sendOrderEmail");


// ================== 1️⃣ Place Order (LOCATION ADDED) ==================
router.post("/place", auth, async(req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0)
            return res.status(400).json({ message: "🛒 Cart khali hai" });

        let totalAmount = 0;
        const validItems = [];
        const foodItems = [];

        cart.items.forEach((item) => {
            if (!item.product || !item.product.price || !item.product.restaurant) return;

            totalAmount += item.product.price * item.quantity;
            validItems.push({ food: item.product._id, quantity: item.quantity });
            foodItems.push({
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            });
        });

        if (validItems.length === 0)
            return res.status(400).json({ message: "❌ Sab cart items invalid hai" });

        // ================== RESTAURANT ==================
        const restaurantId = cart.items[0].product.restaurant;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: "❌ Restaurant not found" });

        // ================== MOBILE & ADDRESS ==================
        const mobile = req.body.mobile || req.user.mobile;
        if (!mobile) return res.status(400).json({ message: "❌ Mobile number required" });

        const address = req.body.address || req.user.address || "No Address Provided";

        // ================== ⭐ LOCATION VALIDATION ==================
        const location = req.body.location;
        if (!location || !location.lat || !location.lng) {
            return res.status(400).json({ message: "❌ Map se exact location select karo" });
        }

        // ================== CREATE ORDER ==================
        const newOrder = await Order.create({
            user: userId,
            restaurant: restaurantId,
            items: validItems,
            foodItems,
            totalPrice: totalAmount,
            paymentMethod: req.body.paymentMethod || "COD",
            address,
            mobile,
            status: "placed",

            // ⭐ SAVE LOCATION (GEOJSON POINT)
            location: {
                type: "Point",
                coordinates: [location.lng, location.lat]
            }
        });

        // ================== EMAIL TRY ==================
        const orderDetails = {
            orderId: newOrder._id,
            customerName: req.user.name,
            items: foodItems,
            totalAmount,
            deliveryTime: 35,
        };

        try {
            await sendOrderEmail(req.user.email, restaurant.email, orderDetails);
        } catch (err) {
            console.error("❌ Email failed:", err.message);
        }

        // ================== CART CLEAR ==================
        await Cart.findOneAndDelete({ user: userId });

        res.status(201).json({
            message: "✅ Order placed with live location",
            order: newOrder
        });

    } catch (err) {
        console.error("❌ Order error:", err.message);
        res.status(500).json({ message: "Order place nahi ho paya", error: err.message });
    }
});



// ================== 2️⃣ My Orders ==================
router.get("/my-orders", auth, async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.food", "name price image")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "✅ Your orders fetched", orders });
    } catch (err) {
        console.error("❌ Failed to fetch orders:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



// ================== 3️⃣ Admin - All Orders ==================
router.get("/all", auth, roleCheck(["admin", "masteradmin", "partner"]), async(req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.food", "name price")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "✅ Orders fetched", orders });
    } catch (err) {
        console.error("❌ Orders fetch error:", err.message);
        res.status(500).json({ message: "Orders fetch nahi ho paye", error: err.message });
    }
});



// ================== 4️⃣ Orders Count ==================
router.get("/count", auth, roleCheck(["admin", "masteradmin"]), async(req, res) => {
    try {
        const count = await Order.countDocuments();
        res.status(200).json({ totalOrders: count });
    } catch (err) {
        console.error("❌ Order count error:", err.message);
        res.status(500).json({ message: "Count fetch nahi ho paya" });
    }
});



// ================== 5️⃣ Total Revenue ==================
router.get("/total-revenue", auth, roleCheck(["admin"]), async(req, res) => {
    try {
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + Number(order.totalPrice || 0), 0);
        res.status(200).json({ totalRevenue });
    } catch (error) {
        console.error("❌ Failed to calculate revenue:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});



// ================== 6️⃣ Monthly Sales for Chart ==================
router.get("/monthly-sales", auth, roleCheck(["admin"]), async(req, res) => {
    try {
        const orders = await Order.find();

        const months = ["Jan", "Feb", "Feb", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthlyRevenue = months.map((month, index) => {
            const revenue = orders
                .filter((order) => order.createdAt.getMonth() === index)
                .reduce((acc, order) => acc + Number(order.totalPrice || 0), 0);
            return { month, revenue };
        });

        res.status(200).json(monthlyRevenue);
    } catch (err) {
        console.error("❌ Monthly sales fetch error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



// ================== 7️⃣ Single Order Detail ==================
router.get("/:id", auth, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("restaurant", "name")
            .populate("items.food", "name price image");

        if (!order) return res.status(404).json({ message: "❌ Order nahi mila" });

        res.status(200).json({ message: "✅ Order fetched", order });
    } catch (err) {
        console.error("❌ Order fetch error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



// ================== 8️⃣ Update Order Status ==================
router.patch("/update-status/:id", auth, roleCheck(["admin", "masteradmin", "partner"]), async(req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "❌ Order nahi mila" });

        if (req.body.status) order.status = req.body.status;
        if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;

        await order.save();
        res.json({ message: "✅ Order update ho gaya", order });
    } catch (err) {
        console.error("❌ Order update error:", err.message);
        res.status(500).json({ message: "Order update nahi ho paya", error: err.message });
    }
});



// ================== 9️⃣ Delete Order ==================
router.delete("/:id", auth, roleCheck(["admin", "masteradmin", "partner"]), async(req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "❌ Order not found" });

        res.json({ message: "✅ Order deleted successfully" });
    } catch (err) {
        console.error("❌ Delete order error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;