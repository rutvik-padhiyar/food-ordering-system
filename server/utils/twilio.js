// utils/twilio.js
const twilio = require("twilio");

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async(to, message) => {
    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });
        console.log("📩 SMS sent:", result.sid);
        return result;
    } catch (error) {
        console.error("❌ SMS send error:", error.message);
        throw error;
    }
};

module.exports = sendSMS;