const mongoose = require("mongoose");

const restaurantAuthSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },

    // ✅ Role field
    role: { type: String, default: "restaurant" },
}, { timestamps: true });

module.exports =
    mongoose.models.RestaurantAuth ||
    mongoose.model("RestaurantAuth", restaurantAuthSchema);