const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    category: String,
    address: String,
    rating: String,
    deliveryTime: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;