const DeliveryPartner = require("../models/deliveryModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

// 📍 Address → Lat/Lng from TomTom
async function getLatLng(address) {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}`;
    const { data } = await axios.get(url);

    if (data.results && data.results.length > 0) {
        return {
            lat: data.results[0].position.lat,
            lon: data.results[0].position.lon
        };
    } else {
        throw new Error("Address not found");
    }
}

// 🚚 Signup
exports.signupDelivery = async(req, res) => {
    try {
        const { name, email, password, phone, vehicleType, address } = req.body;

        const existing = await DeliveryPartner.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const latLng = await getLatLng(address);

        const newPartner = await DeliveryPartner.create({
            name,
            email,
            password: hashed,
            phone,
            vehicleType,
            address,
            location: { type: "Point", coordinates: [latLng.lon, latLng.lat] }, // ✅ lng, lat
            isAvailable: true
        });

        res.status(201).json({ message: "Delivery partner registered", partner: newPartner });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
};

// 🚚 Login
exports.loginDelivery = async(req, res) => {
    try {
        const { email, password } = req.body;

        const partner = await DeliveryPartner.findOne({ email });
        if (!partner) return res.status(404).json({ message: "Partner not found" });

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, partner });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

// 🚦 Update Availability
exports.updateAvailability = async(req, res) => {
    try {
        const { id, isAvailable } = req.body;
        const partner = await DeliveryPartner.findByIdAndUpdate(
            id, { isAvailable }, { new: true }
        );

        if (!partner) return res.status(404).json({ message: "Partner not found" });

        res.json({ message: "Availability updated", partner });
    } catch (err) {
        res.status(500).json({ message: "Failed to update availability", error: err.message });
    }
};
// 📍 Nearby Delivery Partners
exports.getNearbyDelivery = async(req, res) => {
    try {
        const { latitude, longitude, radius = 5 } = req.query; // radius in km

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "latitude and longitude are required" });
        }

        const nearby = await DeliveryPartner.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius) * 1000 // meters
                }
            },
            availability: "free"
        });

        res.json({ nearby });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get nearby partners", error: err.message });
    }
};