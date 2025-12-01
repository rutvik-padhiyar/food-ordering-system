const express = require("express");
const router = express.Router();
const {
    signupDelivery,
    loginDelivery,
    updateAvailability,
    getNearbyDelivery
} = require("../controllers/deliveryAuthController");

// ✅ Delivery Partner Auth
router.post("/signup", signupDelivery);
router.post("/login", loginDelivery);

// ✅ Update Availability (free / busy)
router.put("/availability", updateAvailability);

// ✅ Get Nearby Delivery Partners
router.get("/nearby", getNearbyDelivery);

module.exports = router;