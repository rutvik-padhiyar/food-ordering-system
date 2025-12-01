const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    addressId: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "success" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);