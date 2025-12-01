const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: false, // Optional for admin-added products
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String, // Cloudinary or local path
    },
    address: {
        type: String,
        trim: true,
        default: "",
    },
    category: {
        type: String,
        required: true, // e.g. Cold Drinks, Street Food
    },
    deliveryTime: {
        type: String,
        default: "30-45 min",
    },
    isAvailable: {
        type: Boolean,
        default: true, // Admin can mark product unavailable
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// ✅ Safe model compile: agar Product model already exist kare to reuse karo
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;