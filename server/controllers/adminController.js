const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Restaurant = require("../models/restaurantModel");
const Food = require("../models/foodModel");

//
// ================= ADMIN SUMMARY =================
//
exports.getAdminSummary = async(req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRestaurants = await Restaurant.countDocuments();

        const totalCustomers = await User.countDocuments({
            role: { $in: ["user", "customer"] },
            otpVerified: true,
        });

        res.status(200).json({
            totalOrders,
            totalRestaurants,
            totalCustomers,
        });
    } catch (error) {
        console.error("❌ Error fetching admin summary:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

//
// ================= USER MANAGEMENT =================
//

// ✅ Get all users
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// ✅ Add user
exports.addUser = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to add user" });
    }
};

// ✅ Block user
exports.blockUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = true;
        await user.save();
        res.json({ message: "User blocked successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to block user" });
    }
};

// ✅ Unblock user
exports.unblockUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = false;
        await user.save();
        res.json({ message: "User unblocked successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to unblock user" });
    }
};

// ✅ Delete user
exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete user" });
    }
};

//
// ================= FOOD MANAGEMENT (Admin) =================
//

// ✅ Get all foods
exports.getAllFoods = async(req, res) => {
    try {
        const foods = await Food.find().populate("restaurant", "name");
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch foods" });
    }
};

// ✅ Add food
exports.addFood = async(req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            address,
            rating,
            deliveryTime,
            restaurant,
        } = req.body;

        const food = new Food({
            name,
            description,
            price,
            category,
            address,
            rating,
            deliveryTime,
            restaurant,
            image: req.file ? `/uploads/${req.file.filename}` : "",
        });

        await food.save();
        res.status(201).json({ message: "Food item added successfully", food });
    } catch (err) {
        res.status(500).json({ message: "Failed to add food" });
    }
};

// ✅ Update food
exports.updateFood = async(req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!food) return res.status(404).json({ message: "Food not found" });

        res.json({ message: "Food updated successfully", food });
    } catch (err) {
        res.status(500).json({ message: "Failed to update food" });
    }
};

// ✅ Delete food
exports.deleteFood = async(req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ message: "Food not found" });

        res.json({ message: "Food deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete food" });
    }
};

// ✅ Get single food by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant", "name");
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch food" });
  }
};
