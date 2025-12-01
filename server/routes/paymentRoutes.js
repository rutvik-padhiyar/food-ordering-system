const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const router = express.Router();

// Create Razorpay order
router.post("/create-order", createOrder);

// Verify payment after user completes
router.post("/verify", verifyPayment);

module.exports = router; 