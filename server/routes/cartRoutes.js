// 📁 routes/cartRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Cart = require("../models/cartModel");
const Food = require("../models/foodModel"); // Product reference
const Order = require("../models/orderModel"); // Add your Order model

// ================================
// 1️⃣ Add item to cart
// ================================
router.post("/add", auth, async(req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.json({ message: "✅ Product added to cart", cart });
    } catch (err) {
        res
            .status(500)
            .json({ message: "❌ Failed to add to cart", error: err.message });
    }
});

// ================================
// 2️⃣ Get current user's cart
// ================================
router.get("/", auth, async(req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        // ❌ 404 mat do, empty cart ke liye empty array return karo
        if (!cart) {
            return res.json({ cart: { items: [] } });
        }

        res.json({ cart });
    } catch (err) {
        res
            .status(500)
            .json({ message: "❌ Failed to fetch cart", error: err.message });
    }
});

// ================================
// 3️⃣ Update quantity of a product
// ================================
router.put("/update", auth, async(req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = quantity;
        await cart.save();

        res.json({ message: "✅ Quantity updated", cart });
    } catch (error) {
        res
            .status(500)
            .json({ message: "❌ Error updating quantity", error: error.message });
    }
});

// ================================
// 4️⃣ Remove a single item from cart
// ================================
router.delete("/item/:itemId", auth, async(req, res) => {
    try {
        const userId = req.user._id;
        const itemId = req.params.itemId;

        const cart = await Cart.findOneAndUpdate({ user: userId }, { $pull: { items: { _id: itemId } } }, { new: true }).populate("items.product");

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.json({ message: "🗑️ Item removed from cart", cart });
    } catch (error) {
        res
            .status(500)
            .json({ message: "❌ Failed to remove item", error: error.message });
    }
});

// ================================
// 5️⃣ Clear entire cart
// ================================
router.delete("/clear", auth, async(req, res) => {
    try {
        const userId = req.user._id;

        await Cart.findOneAndDelete({ user: userId });

        res.status(200).json({ message: "🧹 Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to clear cart", error });
    }
});

// ================================
// 6️⃣ Place Order + Clear Cart
// ================================
router.post("/place-order", auth, async(req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body; // [{ productId, quantity }]

        if (!items || items.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        // 1️⃣ Save order to DB
        const order = new Order({
            user: userId,
            items: items.map((i) => ({
                product: i.productId,
                quantity: i.quantity,
            })),
            status: "Pending",
        });
        await order.save();

        // 2️⃣ Clear cart
        await Cart.findOneAndDelete({ user: userId });

        res.status(201).json({ message: "✅ Order placed successfully", order });
    } catch (err) {
        res.status(500).json({ message: "❌ Failed to place order", error: err.message });
    }
});

module.exports = router;