// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const moment = require("moment");

const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");

// Models
const Order = require("../models/orderModel");
const Restaurant = require("../models/restaurantModel");

// Controllers
const {
    getAdminSummary,
    getAllUsers,
    addUser,
    blockUser,
    unblockUser,
    deleteUser,
    getAllFoods,
    addFood,
    updateFood,
    deleteFood,
    getFoodById
} = require("../controllers/adminController");

const {
    addRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    blockRestaurant
} = require("../controllers/restaurantController");

//
// ================= DASHBOARD SUMMARY =================
//
router.get(
    "/dashboard-summary",
    auth,
    roleCheck(["admin", "partner", "masteradmin"]),
    async(req, res) => {
        try {
            const totalCustomers = await require("../models/userModel").countDocuments({ role: "user" });
            const totalPartners = await require("../models/userModel").countDocuments({ role: "partner" });
            const totalRestaurants = await Restaurant.countDocuments();

            const orders = await Order.find({ status: { $in: ["Placed", "Delivered"] } });

            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            const lastWeek = moment().subtract(7, "days").toDate();
            const thisWeekOrders = orders.filter(order => new Date(order.createdAt) > lastWeek);
            const lastWeekOrders = orders.filter(order => new Date(order.createdAt) <= lastWeek);

            const thisRevenue = thisWeekOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            const lastRevenue = lastWeekOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            const growthRevenue = lastRevenue > 0 ? ((thisRevenue - lastRevenue) / lastRevenue) * 100 : 100;

            res.status(200).json({
                totalCustomers,
                totalPartners,
                totalRestaurants,
                totalOrders: orders.length,
                totalRevenue,
                growthRevenue: growthRevenue.toFixed(2),
            });
        } catch (error) {
            console.error("❌ Dashboard summary error:", error);
            res.status(500).json({ message: "Failed to fetch dashboard summary", error: error.message });
        }
    }
);

//
// ================= USER MANAGEMENT =================
//
router.get("/users", auth, roleCheck(["admin", "masteradmin"]), getAllUsers);
router.post("/users", auth, roleCheck(["admin", "masteradmin"]), addUser);
router.put("/users/:id/block", auth, roleCheck(["admin", "masteradmin"]), blockUser);
router.put("/users/:id/unblock", auth, roleCheck(["admin", "masteradmin"]), unblockUser);
router.delete("/users/:id", auth, roleCheck(["admin", "masteradmin"]), deleteUser);

//
// ================= FOOD MANAGEMENT =================
//
router.get("/foods", auth, roleCheck(["admin", "masteradmin"]), getAllFoods);
router.post("/foods", auth, roleCheck(["admin", "masteradmin"]), addFood);
router.put("/foods/:id", auth, roleCheck(["admin", "masteradmin"]), updateFood);
router.delete("/foods/:id", auth, roleCheck(["admin", "masteradmin"]), deleteFood);
router.get("/foods/:id", auth, roleCheck(["admin", "masteradmin"]), getFoodById);

//
// ================= RESTAURANT MANAGEMENT =================
//
router.get("/restaurants", auth, roleCheck(["admin", "masteradmin"]), getAllRestaurants);
router.post("/restaurants/add", auth, roleCheck(["admin", "masteradmin"]), addRestaurant);
router.get("/restaurants/:id", auth, roleCheck(["admin", "masteradmin"]), getRestaurantById);
router.put("/restaurants/:id", auth, roleCheck(["admin", "masteradmin"]), updateRestaurant);
router.delete("/restaurants/:id", auth, roleCheck(["admin", "masteradmin"]), deleteRestaurant);
router.patch("/restaurants/block/:id", auth, roleCheck(["admin", "masteradmin"]), blockRestaurant);

module.exports = router;