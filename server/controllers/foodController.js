// 📄 controllers/foodController.js
const mongoose = require("mongoose");
const Food = require("../models/foodModel");

// ➕ Add Food
exports.addFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      rating,
      address,
      category,
      deliveryTime,
      restaurant,
    } = req.body;

    const newFood = await Food.create({
      name,
      description,
      price,
      rating,
      address,
      category,
      deliveryTime,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      restaurant,
      user: req.userId || null,
    });

    res.status(201).json({ message: "✅ Food item added", food: newFood });
  } catch (error) {
    console.error("❌ Error adding food:", error);
    res.status(500).json({ message: "Failed to add food", error: error.message });
  }
};

// 🔍 Get All Foods (Admin)
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurant", "name email").populate("user", "name email");
    res.json(foods);
  } catch (error) {
    console.error("❌ Error fetching foods:", error);
    res.status(500).json({ message: "Error fetching foods", error: error.message });
  }
};

// 🔍 Get Foods by Restaurant
exports.getFoodsByRestaurant = async (req, res) => {
  try {
    const restaurantObjectId = new mongoose.Types.ObjectId(req.params.id);
    const foodItems = await Food.find({ restaurant: restaurantObjectId });
    res.json(foodItems);
  } catch (err) {
    console.error("❌ Error fetching food:", err);
    res.status(500).json({ message: "Error fetching food", error: err.message });
  }
};

// ✏️ Update Food
exports.updateFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedFood = await Food.findByIdAndUpdate(foodId, updates, { new: true });

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json({ message: "✅ Food updated", food: updatedFood });
  } catch (error) {
    console.error("❌ Error updating food:", error);
    res.status(500).json({ message: "Failed to update food", error: error.message });
  }
};

// 🗑️ Delete Food
exports.deleteFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const deletedFood = await Food.findByIdAndDelete(foodId);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json({ message: "✅ Food deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting food:", error);
    res.status(500).json({ message: "Failed to delete food", error: error.message });
  }
};
