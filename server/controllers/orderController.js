const Order = require("../models/orderModel");
const Restaurant = require("../models/restaurantModel");
const DeliveryPartner = require("../models/deliveryModel");
const sendOrderEmail = require("../utils/sendOrderEmail");

// ================= 1️⃣ Place Order =================
exports.placeOrder = async(req, res) => {
    try {
        const { items, totalAmount, restaurantId, address, mobile, location } = req.body;

        if (!location || !location.lat || !location.lng) {
            return res.status(400).json({ message: "Location required" });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            restaurant: restaurantId,
            foodItems: items.map(i => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity
            })),
            totalPrice: totalAmount,
            paymentMethod: req.body.paymentMethod || "COD",
            address,
            mobile,

            // ⭐ SAVE GEO LOCATION
            location: {
                type: "Point",
                coordinates: [location.lng, location.lat]
            },

            status: "placed",
            deliveryStatus: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Order placed with live location",
            order
        });

    } catch (error) {
        console.error("Order Error:", error.message);
        res.status(500).json({ success: false, message: "Order failed" });
    }
};

// ================= 2️⃣ Restaurant Confirms/Rejects Order =================
exports.restaurantActionOnOrder = async(req, res) => {
    try {
        const { action } = req.body;
        const order = await Order.findById(req.params.id).populate("restaurant");

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (action === "confirm") {
            order.status = "confirmed";

            // ⭐ FIND NEAREST DELIVERY PARTNER
            const nearestPartner = await DeliveryPartner.findOne({
                isAvailable: true,
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: order.location.coordinates
                        },
                        $maxDistance: 5000
                    }
                }
            });

            if (nearestPartner) {
                order.deliveryBoy = nearestPartner._id;
                order.status = "assigned";
                nearestPartner.isAvailable = false;
                await nearestPartner.save();
            }

        } else if (action === "reject") {
            order.status = "rejected";
        }

        await order.save();
        res.json({ message: `Order ${action}ed`, order });

    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
};

// ================= 3️⃣ My Orders =================
exports.getMyOrders = async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.food", "name price image")
            .populate("restaurant", "name")
            .populate("deliveryBoy", "name mobile")
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Your orders fetched", orders });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
};

// ================= 4️⃣ Delivery Boy Updates Status =================
exports.updateDeliveryStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.deliveryStatus = status;

        if (status === "delivered" && order.deliveryBoy) {
            const deliveryBoy = await DeliveryPartner.findById(order.deliveryBoy);
            if (deliveryBoy) {
                deliveryBoy.isAvailable = true;
                await deliveryBoy.save();
            }
            order.status = "delivered";
        }

        await order.save();
        res.json({ message: "Delivery status updated", order });
    } catch (err) {
        res.status(500).json({ message: "Failed to update delivery status", error: err.message });
    }
};