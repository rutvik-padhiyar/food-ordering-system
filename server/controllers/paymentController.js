const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
exports.createOrder = async(req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        return res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log("Create Order Error:", error);
        return res.status(500).json({ success: false, error: "Order create failed" });
    }
};

// ✅ Verify Payment
exports.verifyPayment = async(req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        return res.json({
            success: true,
            message: "Payment verified",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });

    } catch (error) {
        console.log("Verify Error:", error);
        return res.status(500).json({ success: false, error: "Payment verification failed" });
    }
};