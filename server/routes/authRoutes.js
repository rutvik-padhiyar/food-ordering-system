const express = require("express");
const router = express.Router();

const {
    signup,
    //signupRestaurant,
    signupDelivery, // ✅ delivery partner signup
    login,
    sendSignupOtp,
    verifySignupOtp,
    sendOtp,
    verifyOtp,
    resetPassword,
} = require("../controllers/authController");

// 🟡 Signup Flow (Email OTP)
router.post("/send-signup-otp", sendSignupOtp); // ✅ Step 1: Send OTP to email
router.post("/verify-signup-otp", verifySignupOtp); // ✅ Step 2: Verify OTP
router.post("/signup", signup); // ✅ Normal User Signup (role = "user")

// 🆕 Restaurant Partner Signup
//router.post("/signup/restaurant", signupRestaurant); // ✅ Restaurant signup (role = "restaurant")

// 🆕 Delivery Partner Signup
router.post("/signup/delivery", signupDelivery); // ✅ Delivery signup (role = "delivery")

// 🟢 Login
router.post("/login", login);

// 🔴 Forgot Password via Mobile OTP (remains as is)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;