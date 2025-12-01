const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/restaurantAuthController");

// ✅ Signup Route
router.post("/signup", async(req, res) => {
    try {
        await signup(req, res);
    } catch (error) {
        console.error("❌ Signup route error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Login Route
router.post("/login", async(req, res) => {
    try {
        await login(req, res);
    } catch (error) {
        console.error("❌ Login route error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;