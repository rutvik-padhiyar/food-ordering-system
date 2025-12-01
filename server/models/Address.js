const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    mobile: String,
    pincode: String,
    locality: String,
    fullAddress: { type: String, required: true },
    city: String,
    state: String,
    landmark: String,
    alternatePhone: String,
    addressType: { type: String, enum: ["Home", "Work"], default: "Home" },
    latitude: Number,
    longitude: Number,
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);